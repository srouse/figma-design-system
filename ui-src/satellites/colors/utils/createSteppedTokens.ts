import {
  MessageRequest,
  MessageRequestStyle,
  TokenGroup
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";
import { ColorStepMetrics } from "./colorStepping";

export default async function createSteppedTokens(
  name: string,
  baseColor: string,
  colorStepsBaseMetrics: ColorStepMetrics | undefined,
  tokenGroup: TokenGroup,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
) {
  if (!name || !baseColor || !colorStepsBaseMetrics || !tokenGroup) return;

  // build steps into this variable
  const steps: {name:string,color:string}[] = [];

  // find the center index
  let centerIndex = 3;
  colorStepsBaseMetrics.options.find((option, index) => {
    if (Array.isArray(option.value)) {
      if (
        (option.value as string[]).indexOf(
          colorStepsBaseMetrics.default
        ) !== -1
      ) {
        centerIndex = index;
        return true;
      }
    }else{
      if (option.value === colorStepsBaseMetrics.default) {
        centerIndex = index;
        return true;
      }
    }
    return false;
  });

  // create steps
  colorStepsBaseMetrics.options.map((option, index) => {
    if (Array.isArray(option.value)) {
      option.value.map(val => {
        steps.push({
          name: val,
          color: colorStepsBaseMetrics.multiplier(
            baseColor, centerIndex, index, 
            {
              ...option,
              value: val,// flatten values for multiplier
            },
            colorStepsBaseMetrics.options
          ),
        });
      })
    }else{
      steps.push({
        name: option.value,
        color: colorStepsBaseMetrics.multiplier(
          baseColor, centerIndex, index, 
          option,
          colorStepsBaseMetrics.options
        ),
      });
    }
  });

  // Stepped Colors into Styles
  const promiseArr: any[] = [];
  steps.map((stepResult) => {
    if (stepResult.color === undefined) return;
    const stepName = `${name}${
      stepResult.name ? `-${stepResult.name.toLowerCase()}` : ''}`;
    promiseArr.push((async () => {
      return await postMessagePromise(
        MessageRequest.createStyle,
        {
          style: {
            type: MessageRequestStyle.color,
            name: `${name}/${stepName}`,
            value: stepResult.color,
          }
        }
      );
    })());
  });
  await Promise.all(promiseArr);

  const finalTokenGroup = {
    ...tokenGroup,
    name,// just the name so we can build from styles
  };
  updateTokenGroup(finalTokenGroup);
}