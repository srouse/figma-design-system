export enum SpacingStepTypes {
  none = 'none',
  smallestToLargest = 'smallestToLargest',
  tshirtSizes = 'tshirtSizes',
  sequenceSizes = 'sequenceSizes',
  sequenceWithFractionsSizes = 'sequenceWithFractionsSizes',
  spacingGroup = "spacingGroup",
}

export type SpacingStepMetricOption = {
  name:string,
  value:string,
  multiplier?:number
}

export type SpacingStepMetrics = {
  default: string,
  zeroOption: {name:string,size:0},
  options: SpacingStepMetricOption[],
  multiplier: (
    baseSize: number,
    centerIndex: number,
    offsetIndex: number,
    option: SpacingStepMetricOption,
    options: SpacingStepMetricOption[],
  ) => number;
};

export const spacingSteps = [
  {
    name: 'Choose a Step Pattern',
    value: SpacingStepTypes.none,
  },
  {
    name: 'small[er, est], large[r,st]',
    value: SpacingStepTypes.smallestToLargest
  },
  {
    name: 'xxxl, xxl, xl, l, m, s, xs, xxs, xxxs',
    value: SpacingStepTypes.tshirtSizes
  },
  {
    name: '0, 1, 2, 3, 4, ...8',
    value: SpacingStepTypes.sequenceSizes
  },
  {
    name: '0, 1[-3,-6,-9], 2[-3,-6,-9], 3, 4, ...8',
    value: SpacingStepTypes.sequenceWithFractionsSizes
  },
  {
    name: 'Custom Group',
    value: SpacingStepTypes.spacingGroup
  },
];

export const spacingStepBaseOptions: {[key:string]:SpacingStepMetrics} = 
{
  [SpacingStepTypes.smallestToLargest] : {
    default: 'medium',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'Smallest', value:'smallest'},
      {name:'Smaller',  value:'smaller'},
      {name:'Small',    value:'small'},
      {name:'Medium',   value:'medium'},
      {name:'Large',    value:'large'},
      {name:'Larger',   value:'larger'},
      {name:'Largest',  value:'largest'},
    ],
    multiplier: multiplierHalves
  },
  [SpacingStepTypes.tshirtSizes] : {
    default: 'md',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'xxxs',   value:'xxxs'},
      {name:'xxs',    value:'xxs'},
      {name:'xs',     value:'xs'},
      {name:'sm',     value:'sm'},
      {name:'md',     value:'md'},
      {name:'lg',     value:'lg'},
      {name:'xl',     value:'xl'},
      {name:'xxl',    value:'xxl'},
      {name:'xxxl',   value:'xxxl'},
    ],
    multiplier: multiplierHalves
  },
  [SpacingStepTypes.sequenceSizes] : {
    default: '1',
    zeroOption: {name:'0',size:0},
    options: [
      {name:'1',   value:'1'},
      {name:'2',   value:'2'},
      {name:'3',   value:'3'},
      {name:'4',   value:'4'},
      {name:'5',   value:'5'},
      {name:'6',   value:'6'},
      {name:'7',   value:'7'},
      {name:'8',   value:'8'},
    ],
    multiplier: multiplierIncremental
  },
  [SpacingStepTypes.sequenceWithFractionsSizes] : {
    default: '1',
    zeroOption: {name:'0',size:0},
    options: [
      {name:'0-3',  value:'0-3',  multiplier: 0.25},
      {name:'0-6',  value:'0-6',  multiplier: 0.5},
      {name:'0-9',  value:'0-9',  multiplier: 0.75},
      {name:'1',    value:'1',    multiplier: 1},
      {name:'1-3',  value:'1-3',  multiplier: 1.25},
      {name:'1-6',  value:'1-6',  multiplier: 1.5},
      {name:'1-9',  value:'1-9',  multiplier: 1.75},
      {name:'2',    value:'2',    multiplier: 2},
      {name:'3',    value:'3',    multiplier: 3},
      {name:'4',    value:'4',    multiplier: 4},
      {name:'5',    value:'5',    multiplier: 5},
      {name:'6',    value:'6',    multiplier: 6},
      {name:'7',    value:'7',    multiplier: 7},
      {name:'8',    value:'8',    multiplier: 8},
    ],
    multiplier: multiplierIncremental
  },
}

function multiplierHalves(
  baseSize: number,
  centerIndex: number,
  index: number
) {
  const offsetIndex = index - centerIndex;
  if (offsetIndex > 0) {
    return baseSize * (1 + offsetIndex*.5);
  }else if (offsetIndex < 0) {
    let offset = 1;
    [...Array(Math.abs(offsetIndex))].map((val: any, i: number) => {
      offset = offset*.5
    });
    return baseSize * offset;
  }else{
    return baseSize;
  }
}

function multiplierIncremental(
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
  option: SpacingStepMetricOption,
  options: SpacingStepMetricOption[]
) {
  const multiplier = option.multiplier === undefined ? 
    offsetIndex+1 : option.multiplier;
  const centerOption = options[centerIndex];
  const centerMultiplier = centerOption.multiplier === undefined ?
    centerIndex+1 : centerOption.multiplier;
  return (baseSize / centerMultiplier) * multiplier;
}