import { DSysGroupType, DSysLevel, DSysSpacingTokenset, DTTokenType, TokenGroup } from "../../../../shared";
import uid from "../../../utils/uid";
import { SpacingStepMetrics } from "./spacingStepping";

export default function createNewSteppedSpacingTokens(
  name: string | undefined,
  baseSize: number | undefined,
  spaceStepsBaseMetrics: SpacingStepMetrics | undefined,
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
) {
  if (!name || !baseSize || !spaceStepsBaseMetrics || !tokenGroup) return;

  const tokenset: DSysSpacingTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.Spacing,
      "dsys.name": name,
      "dsys.nodeId": '?'
    },
    $description: 'a set of spacing tokens',
  }

  const newTokenGroup: TokenGroup = {
    ...tokenGroup,
    name,
    tokensets: [tokenset]
  };

  // build steps into this variable
  const steps: {name:string,size:number}[] = [];

  // find the center index
  let centerIndex = 3;
  spaceStepsBaseMetrics.options.find((option, index) => {
    if (option.value === spaceStepsBaseMetrics.default) {
      centerIndex = index;
      return true;
    }
    return false;
  });

  // create steps
  spaceStepsBaseMetrics.options.map((option, index) => {
    steps.push({
      name: option.value,
      size: spaceStepsBaseMetrics.multiplier(
        baseSize, centerIndex, index, 
        option,
        spaceStepsBaseMetrics.options
      ),
    });
  });
  steps.unshift(spaceStepsBaseMetrics.zeroOption);

  // take steps and build tokens...
  steps.map((step, index) => {
    const finalName = `${name}${step.name ? `-${step.name}` : ''}`;
    tokenset[finalName] = {
      $extensions: {
        'dsys.level': DSysLevel.token,
        "dsys.name": finalName,
        "dsys.index": index,
        "dsys.uid": uid()
      },
      $type: DTTokenType.spacing,
      $value: step.size,
    };
  })

  updateTokenGroup(newTokenGroup);
}