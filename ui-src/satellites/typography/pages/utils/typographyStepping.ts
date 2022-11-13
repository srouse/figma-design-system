

export enum TypographyStepTypes {
  none = 'none',
  stepHtmlTags ='step-html-tags',
  step10TwoDigit = 'step-10-two-digit',
  step10OneDigit = 'step-10-one-digit',
  stepDisplayToLabel = 'stepDisplayToLabel',
  typographyGroup = "typography-group",
}

export type TypographyStepMetricOption = {
  name:string,
  value:string | string[],
  multiplier?:(baseNumber: number ) => number
}

export type TypographyStepMetrics = {
  default: string,
  zeroOption: {name:string,size:0},
  options: TypographyStepMetricOption[],
  multiplier: (
    baseSize: number,
    centerIndex: number,
    offsetIndex: number,
    option: TypographyStepMetricOption,
  ) => number;
};

export const TypographySteps = [
  {
    name: 'Choose a Step Pattern',
    value: TypographyStepTypes.none,
  },
  {
    name: 'h1, h2, h3, h4, h5, h6, p',
    value: TypographyStepTypes.stepHtmlTags,
  },
  {
    name: 'Display, Headline, Title, Body, Label',
    value: TypographyStepTypes.stepDisplayToLabel,
  },
  {
    name: '1, 2, 3, 4, [base:5], 6, 7, 8, 9, 10',
    value: TypographyStepTypes.step10OneDigit,
  },
  {
    name: '10, 20, 30, 40, [base:50], 60, 70, 80, 90, 100',
    value: TypographyStepTypes.step10TwoDigit,
  },
  {
    name: 'Custom Group',
    value: TypographyStepTypes.typographyGroup,
  },
];

export const TypographyStepBaseOptions: {[key:string]:TypographyStepMetrics} = 
{
  [TypographyStepTypes.stepHtmlTags] : {
    default: '',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'H1', value:'h1',             multiplier: () => 13},
      {name:'H2', value:'h2',             multiplier: () => 8},
      {name:'H3', value:'h3',             multiplier: () => 5},
      {name:'H4', value:'h4',             multiplier: () => 3},
      {name:'H5', value:'h5',             multiplier: () => 2},
      {name:'H6', value:'h6',             multiplier: () => 1},
      {name:'P (Base)', value:['p', ''],  multiplier: () => 0},
    ],
    multiplier: simpleMultiplier
  },
  [TypographyStepTypes.step10OneDigit] : {
    default: '5',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'10', value:'10',     multiplier: () => 13},
      {name:'9', value:'9',       multiplier: () => 8},
      {name:'8', value:'8',       multiplier: () => 5},
      {name:'7', value:'7',       multiplier: () => 3},
      {name:'6', value:'6',       multiplier: () => 1},
      {name:'5', value:['5',''],  multiplier: () => 0},
      {name:'4', value:'4',       multiplier: () => -1},
      {name:'3', value:'3',       multiplier: () => -2},
      {name:'2', value:'2',       multiplier: () => -4},
      {name:'1', value:'1',       multiplier: () => -5},
    ],
    multiplier: simpleMultiplier
  },
  [TypographyStepTypes.stepDisplayToLabel] : {
    default: '5',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'Display 1', value:'display-1', multiplier: (n) => n*6},
      {name:'Display 2', value:'display-2', multiplier: (n) => n*4},
      {name:'Display 3', value:'display-3', multiplier: (n) => n*2.75},
      {name:'Headline 1', value:'headline-1', multiplier: (n) => n*2},
      {name:'Headline 2', value:'headline-2', multiplier: (n) => n*1.25},
      {name:'Headline 3', value:'headline-3', multiplier: (n) => n*0.75},
      {name:'Headline 4', value:'headline-4', multiplier: (n) => n*0.5},
      {name:'Title 1', value:'title-1', multiplier: (n) => n*0.375},
      {name:'Title 2', value:'title-2', multiplier: (n) => n*0},
      {name:'Title 3', value:'title-3', multiplier: (n) => n*-0.25},
      {name:'Body 1', value:'body-1', multiplier: (n) => n*0.25},
      {name:'Body 2', value:'body-2', multiplier: (n) => n*0.125},
      {name:'Body 3', value:'body-3', multiplier: (n) => n*0},
      {name:'Body 4', value:'body-4', multiplier: (n) => n*-0.125},
      {name:'Body 5', value:'body-5', multiplier: (n) => n*-0.25},
      {name:'Label 1', value:'label-1', multiplier: (n) => n*0.125},
      {name:'Label 2', value:'label-2', multiplier: (n) => n*0},
      {name:'Label 3', value:'label-3', multiplier: (n) => n*-0.125},
    ],
    multiplier: simpleMultiplier
  },
  [TypographyStepTypes.step10TwoDigit] : {
    default: '50',
    zeroOption: {name:'0',size:0},
    options: [
      {name:'100', value:'100',     multiplier: () => 13},
      {name:'90', value:'90',       multiplier: () => 8},
      {name:'80', value:'80',       multiplier: () => 5},
      {name:'70', value:'70',       multiplier: () => 3},
      {name:'60', value:'60',       multiplier: () => 1},
      {name:'50', value:['50',''],  multiplier: () => 0},
      {name:'40', value:'40',       multiplier: () => -1},
      {name:'30', value:'30',       multiplier: () => -2},
      {name:'20', value:'20',       multiplier: () => -4},
      {name:'10', value:'10',       multiplier: () => -5},
    ],
    multiplier: simpleMultiplier
  },
}

function simpleMultiplier(
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
  option: TypographyStepMetricOption
) {
  if (option.multiplier) return baseSize + option.multiplier(baseSize);
  return baseSize;
}

/*
function multiplier(
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
) {
  return _multiplier(
    baseSize, centerIndex, offsetIndex,
    1.04, 1.06
  )
}

function htmlTagsMultiplier(
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
) {
  return _multiplier(
    baseSize, centerIndex, offsetIndex,
    1,// there are no smaller than base...
    1.01
  )
}

function _multiplier (
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
  smallMultiple: number, largeMultiple: number
) {
  const indexDiff = Math.abs(centerIndex - offsetIndex);
  if (offsetIndex < centerIndex) {// smaller
    let sizeOffset = 1;
    [...Array(indexDiff-1)].map(() => {
      sizeOffset += sizeOffset * smallMultiple;
    });
    return  baseSize - Math.floor(sizeOffset);
  }else if (offsetIndex > centerIndex){ // larger
    let sizeOffset = 1;
    [...Array(indexDiff-1)].map(() => {
      sizeOffset += sizeOffset * largeMultiple;
    });
    return Math.floor(sizeOffset) + baseSize;
  }else{
    return baseSize;// else it's the base size
  }
}
*/
