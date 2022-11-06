import { DSysGroupType, DSysLevel, DSysSpacingTokenset, DTTokenType, TokenGroup } from "../../../../shared";
import uid from "../../../utils/uid";
import { SpacingStepTypes } from "./spacingStepping";

export default function createNewSteppedSpacingTokens(
  name: string | undefined,
  baseSize: number | undefined,
  spaceStepsType: SpacingStepTypes,
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void
) {
  if (!name || !tokenGroup || !baseSize) return;

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

  let steps: {name:string,size:number}[] = [];
  switch (spaceStepsType) {
    case SpacingStepTypes.smallestToLargest :
      steps = [
        {name:'none',       size:0},
        {name:'smallest',   size:baseSize*0.25},
        {name:'smaller',    size:baseSize*0.5},
        {name:'small',      size:baseSize},
        {name:'medium',     size:baseSize*1.5},
        {name:'large',      size:baseSize*2},
        {name:'larger',     size:baseSize*2.5},
        {name:'largest',    size:baseSize*3},
      ];
      break;
    case SpacingStepTypes.tshirtSizes :
      steps = [
        {name:'none',     size:0},
        {name:'xxxs',     size:baseSize*0.1},
        {name:'xxs',      size:baseSize*0.25},
        {name:'xs',       size:baseSize*0.5},
        {name:'sm',       size:baseSize},
        {name:'md',       size:baseSize*1.5},
        {name:'lg',       size:baseSize*2},
        {name:'xl',       size:baseSize*2.5},
        {name:'xxl',      size:baseSize*3},
        {name:'xxxl',     size:baseSize*4},
      ];
      break;
    case SpacingStepTypes.sequenceSizes :
      steps = [
        {name:'0',      size:0},
        {name:'1',      size:baseSize},
        {name:'2',      size:baseSize*2},
        {name:'3',      size:baseSize*3},
        {name:'4',      size:baseSize*4},
        {name:'5',      size:baseSize*5},
        {name:'6',      size:baseSize*6},
        {name:'7',      size:baseSize*7},
        {name:'8',      size:baseSize*8},
      ];
    case SpacingStepTypes.sequenceWithFractionsSizes :
      steps = [
        {name:'0',      size:0},
        {name:'0-3',    size:baseSize*0.25},
        {name:'0-6',    size:baseSize*0.5},
        {name:'0-9',    size:baseSize*0.75},
        {name:'1',      size:baseSize},
        {name:'1-3',    size:baseSize*1.25},
        {name:'1-6',    size:baseSize*1.5},
        {name:'1-9',    size:baseSize*1.75},
        {name:'2',      size:baseSize*2},
        {name:'3',      size:baseSize*3},
        {name:'4',      size:baseSize*4},
        {name:'5',      size:baseSize*5},
        {name:'6',      size:baseSize*6},
        {name:'7',      size:baseSize*7},
        {name:'8',      size:baseSize*8},
      ];
      break;
    case SpacingStepTypes.spacingGroup :
      steps = [
        {name:'',      size:baseSize},
      ];
      break;
  }

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