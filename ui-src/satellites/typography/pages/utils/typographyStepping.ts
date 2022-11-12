

export enum TypographyStepTypes {
  none = 'none',
  stepHtmlTags ='step-html-tags',
  step10TwoDigit = 'step-10-two-digit',
  step10OneDigit = 'step-10-one-digit',
  typographyGroup = "typography-group",
}

export type TypographyStepMetricOption = {
  name:string,
  value:string | string[],
  multiplier?:number
}

export type TypographyStepMetrics = {
  default: string,
  zeroOption: {name:string,size:0},
  options: TypographyStepMetricOption[],
  multiplier: (
    baseFamilty: string,
    baseStyle: string,
    baseSize: number,
    centerIndex: number,
    offsetIndex: number,
    option: TypographyStepMetricOption,
    options: TypographyStepMetricOption[],
  ) => string;
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
    name: '1, 2, 3, 4, [base:5], 6, 7, 8, 9, 10',
    value: TypographyStepTypes.step10OneDigit,
  },
  {
    name: '10, 20, 30, 40, [base:50], 60, 70, 80, 90, 100',
    value: TypographyStepTypes.step10TwoDigit,
  },
  {
    name: 'Typography Group',
    value: TypographyStepTypes.typographyGroup,
  },
];

export const TypographyStepBaseOptions: {[key:string]:TypographyStepMetrics} = 
{
  [TypographyStepTypes.stepHtmlTags] : {
    default: '',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'H1', value:'h1'},
      {name:'H2', value:'h2'},
      {name:'H3', value:'h3'},
      {name:'H4', value:'h4'},
      {name:'H5', value:'h5'},
      {name:'H6', value:'h6'},
      {name:'P (Base)', value:['p', '']},
    ],
    multiplier: multiplier
  },
  [TypographyStepTypes.step10OneDigit] : {
    default: '5',
    zeroOption: {name:'none',size:0},
    options: [
      {name:'1',   value:'1'},
      {name:'2',   value:'2'},
      {name:'3',   value:'3'},
      {name:'4',   value:'4'},
      {name:'5',   value:['5','']},
      {name:'6',   value:'6'},
      {name:'7',   value:'7'},
      {name:'8',   value:'8'},
      {name:'9',   value:'9'},
      {name:'10',   value:'10'},
    ],
    multiplier: multiplier
  },
  [TypographyStepTypes.step10TwoDigit] : {
    default: '50',
    zeroOption: {name:'0',size:0},
    options: [
      {name:'10',   value:'10'},
      {name:'20',   value:'20'},
      {name:'30',   value:'30'},
      {name:'40',   value:'40'},
      {name:'50',   value:['50','']},
      {name:'60',   value:'60'},
      {name:'70',   value:'70'},
      {name:'80',   value:'80'},
      {name:'90',   value:'90'},
      {name:'100',   value:'100'},
    ],
    multiplier: multiplier
  },
}

function multiplier(
  baseFamilty: string,
  baseStyle: string,
  baseSize: number,
  centerIndex: number,
  offsetIndex: number,
  option: TypographyStepMetricOption,
  options: TypographyStepMetricOption[],
) {
  return 'dd';
}