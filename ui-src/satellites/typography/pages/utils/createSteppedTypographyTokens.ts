import {
  MessageRequest,
  MessageRequestStyle,
  TokenGroup
} from "../../../../../shared";
import postMessagePromise from "../../../../utils/postMessagePromise";
import { TypographyStepMetrics } from "./typographyStepping";

export default async function createSteppedTypographyTokens(
  name: string | undefined,
  baseFontFamily: string | undefined,
  baseFontStyle: string | undefined,
  baseSize: number | undefined,
  typographyStepsBaseMetrics: TypographyStepMetrics | undefined,
  tokenGroup: TokenGroup,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
) {
  if (
    !name ||
    !baseFontFamily ||
    !baseFontStyle ||
    !baseSize ||
    !typographyStepsBaseMetrics ||
    !tokenGroup
  ) return;

  // create a container tokengroup for styles to be pushed into...
  const finalTokenGroup = {
    ...tokenGroup,
    name,// just the name so we can build from styles
  };
  await updateTokenGroup(finalTokenGroup);

  // build steps into this variable
  const steps: {
    name:string,
    fontFamily:string,
    fontStyle:string,
    size: number,
  }[] = [];

  // find the center index
  let centerIndex = 3;
  typographyStepsBaseMetrics.options.find((option, index) => {
    if (Array.isArray(option.value)) {
      if (
        (option.value as string[]).indexOf(
          typographyStepsBaseMetrics.default
        ) !== -1
      ) {
        centerIndex = index;
        return true;
      }
    }else{
      if (option.value === typographyStepsBaseMetrics.default) {
        centerIndex = index;
        return true;
      }
    }
    return false;
  });

  // create steps
  typographyStepsBaseMetrics.options.map((option, index) => {
    if (Array.isArray(option.value)) {
      option.value.map(val => {
        steps.push({
          name: val,
          fontFamily: baseFontFamily,
          fontStyle: baseFontStyle,
          size: typographyStepsBaseMetrics.multiplier(
            baseSize, centerIndex, index, option,
          ),
        });
      })
    }else{
      steps.push({
        name: option.value,
        fontFamily: baseFontFamily,
        fontStyle: baseFontStyle,
        size: typographyStepsBaseMetrics.multiplier(
          baseSize, centerIndex, index, option,
        ),
      });
    }
  });

  // Stepped Colors into Styles
  const promiseArr: any[] = [];
  steps.map((stepResult) => {
    if (
      stepResult.fontFamily === undefined ||
      stepResult.fontStyle === undefined ||
      stepResult.size === undefined
    ) return;
    const stepName = `${name}${
      stepResult.name ? `-${stepResult.name.toLowerCase()}` : ''}`;
    promiseArr.push((async () => {
      return postMessagePromise(
        MessageRequest.createStyle,
        {
          style: {
            type: MessageRequestStyle.text,
            name: `${name}/${stepName}`,
            value: {
              fontSize    : stepResult.size,
              fontName    : {
                family: stepResult.fontFamily,
                style: stepResult.fontStyle
              }
            },
          }
        }
      );
    })());
  });
  await Promise.all(promiseArr);
  return true;
}