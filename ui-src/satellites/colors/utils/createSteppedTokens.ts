import {
  MessageRequest,
  MessageRequestStyle,
  TokenGroup
} from "../../../../shared";
import { Result } from "../../../../shared/types/types";
import postMessagePromise from "../../../utils/postMessagePromise";
import stepBaseColor from "./stepBaseColor";

export default async function createSteppedTokens(
  stateSteps: string,
  baseColor: string,
  tokenGroupName: string,
  tokenGroup: TokenGroup,
  updateTokenGroup: (tokenGroup: TokenGroup) => void
) : Promise<Result> {
  /*const validation = this.validator.validateAll();
  if (validation.length > 0) {
    return;
  }*/

  const steps = stateSteps.split(',');
  const steppedColors = stepBaseColor(
    baseColor,
    steps
  );
  if (!tokenGroup) return {success: false, message: 'no token group'};

  // Stepped Colors into Styles
  const promiseArr: any[] = [];
  steppedColors.steps?.map((stepResult, index) => {
    if (stepResult.step === undefined) return;
    const stepName = `${tokenGroupName}${
      stepResult.step ? `-${stepResult.step.toLowerCase()}` : ''}`;

    promiseArr.push((async () => {
      return await postMessagePromise(
        MessageRequest.createStyle,
        {
          style: {
            type: MessageRequestStyle.color,
            name: `${tokenGroupName}/${stepName}`,
            value: stepResult,
          }
        }
      );
    })());
  });
  await Promise.all(promiseArr);

  const finalTG = {
    ...tokenGroup,
    name: tokenGroupName,// just the name so we can build from styles
  };

  updateTokenGroup(finalTG);
  return {success: true};
}