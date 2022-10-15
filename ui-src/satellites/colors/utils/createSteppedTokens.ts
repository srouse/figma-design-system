import { DSysGroupType, DSysLevel, DSysToken, DSysTokenset, DTTokenType, MessageRequest, MessageRequestStyle, TokenGroup } from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";
import stepBaseColor from "./stepBaseColor";


export default async function createSteppedTokens(
  stateSteps: string,
  baseColor: string,
  tokenGroupName: string,
  tokenGroup: TokenGroup,
  updateTokenGroup: (tokenGroup: TokenGroup) => void
) {
  /*const validation = this.validator.validateAll();
  if (validation.length > 0) {
    return;
  }*/

  const steps = stateSteps.split(',');
  const steppedColors = stepBaseColor(
    baseColor,
    steps
  );
  if (!tokenGroup) return;

  const tg = tokenGroup;
  const newTokenSet : DSysTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.ColorSet,
      'dsys.name': tokenGroupName || '',
      "dsys.nodeId": tg.nodeId,
    },
    $description:
      `Color tokens with the named ${tokenGroupName} and steps ${stateSteps}`,
  };

  const promiseArr: any[] = [];
  const finalTokenGroupName = tokenGroupName ? 
    tokenGroupName.toLowerCase() : '';

  steppedColors.steps?.map((stepResult, index) => {
    if (stepResult.step === undefined) return;

    const stepName = `${finalTokenGroupName}${stepResult.step ? 
      `-${stepResult.step.toLowerCase()}` : ''}`;

    const newToken : DSysToken = {
      $extensions: {
        'dsys.level'    : DSysLevel.token,
        'dsys.name'     : stepName,
        'dsys.index'    : index,
        'dsys.styleId'  : '',
      },
      $value: {
        hex: stepResult.hex,
        alpha: 1,
      },
      $type: DTTokenType.color
    };
    newTokenSet[stepName] = newToken;

    promiseArr.push((async () => {
      const result: any = await postMessagePromise(
        MessageRequest.createStyle,
        {
          style: {
            type: MessageRequestStyle.color,
            name: `${finalTokenGroupName}/${stepName}`,
            value: stepResult,
          }
        }
      );
      newToken.$extensions['dsys.styleId'] = result.style.id;
      return newToken;
    })());
  });

  await Promise.all(promiseArr);

  const finalTG = {
    ...tg,
    name: finalTokenGroupName,
    tokensets: [newTokenSet]
  };

  updateTokenGroup(finalTG);
}