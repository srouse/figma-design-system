import Colr from 'colr';

export enum ColorStepTypes {
  none = 'none',
  stepLightestToDarkest ='lightest-to-darkest',
  step9ThreeDigit = 'step-9-three-digit',
  step9ThreeDigitGreys = 'step-9-three-digit-greys',
  step9TwoDigit = 'step-9-two-digit',
  step9TwoDigitGreys = 'step-9-two-digit-greys',
  step9OneDigit = 'step-9-one-digit',
  step9OneDigitGreys = 'step-9-one-digit-greys',
  colorGroup = "color-group",
}

export type ColorStepMetricOption = {
  name:string,
  value:string | string[],
  multiplier?:number
}

export type ColorStepMetrics = {
  default: string,
  max: {value:number, saturation: number},
  min: {value:number, saturation: number},
  options: ColorStepMetricOption[],
  multiplier: (
    baseColor: string,
    centerIndex: number,
    offsetIndex: number,
    option: ColorStepMetricOption,
    options: ColorStepMetricOption[],
    metrics: ColorStepMetrics,
  ) => string;
};

export const ColorSteps = [
  {
    name: 'Choose a Step Pattern',
    value: ColorStepTypes.none,
  },
  /*{
    name: 'lightest, lighter, light, [base], dark, darker, darkest',
    value: ColorStepTypes.stepLightestToDarkest,
  },*/
  {
    name: 'Color - 1, 2, 3, 4, [base:5], 6, 7, 8, 9',
    value: ColorStepTypes.step9OneDigit,
  },
  {
    name: 'Grey - 0, 1, 2, 3, 4, [base:5], 6, 7, 8, 9, 10',
    value: ColorStepTypes.step9OneDigitGreys,
  },
  {
    name: 'Color - 10, 20, 30, 40, [base:50], 60, 70, 80, 90',
    value: ColorStepTypes.step9TwoDigit,
  },
  {
    name: 'Grey - 00, 10, 20, 30, 40, [base:50], 60, 70, 80, 90, 100',
    value: ColorStepTypes.step9TwoDigitGreys,
  },
  {
    name: 'Color - 100, 200, 300, 400, [base:500], 600, 700, 800, 900',
    value: ColorStepTypes.step9ThreeDigit,
  },
  {
    name: 'Grey - 000, 100, 200, 300, 400, [base:500], 600, 700, 800, 900, 1000',
    value: ColorStepTypes.step9ThreeDigitGreys,
  },
  {
    name: 'Custom Group',
    value: ColorStepTypes.colorGroup,
  },
];

export const ColorStepBaseOptions: {[key:string]:ColorStepMetrics} = 
{
  [ColorStepTypes.stepLightestToDarkest] : {
    default: '',
    // zeroOption: {name:'none',size:0},
    max: {value:100, saturation: 100},
    min: {value:36, saturation: 20},
    options: [
      {name:'Lightest', value:'lightest'},
      {name:'Lighter', value:'lighter'},
      {name:'Light', value:'light'},
      {name:'[Base]', value:''},
      {name:'Dark', value:'dark'},
      {name:'Darker', value:'darker'},
      {name:'Darkest', value:'darkest'},
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9OneDigit] : {
    default: '5',
    max: {value:100, saturation: 100},
    min: {value:36, saturation: 20},
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
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9OneDigitGreys] : {
    default: '5',
    max: {value:100, saturation: 10},
    min: {value:0, saturation: 0},
    options: [
      {name:'0',   value:'0'},
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
  [ColorStepTypes.step9TwoDigit] : {
    default: '50',
    max: {value:100, saturation: 100},
    min: {value:36, saturation: 20},
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
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9TwoDigitGreys] : {
    default: '50',
    max: {value:100, saturation: 10},
    min: {value:0, saturation: 0},
    options: [
      {name:'00',   value:'00'},
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
  [ColorStepTypes.step9ThreeDigit] : {
    default: '500',
    max: {value:100, saturation: 100},
    min: {value:36, saturation: 20},
    options: [
      {name:'100',   value:'100'},
      {name:'200',   value:'200'},
      {name:'300',   value:'300'},
      {name:'400',   value:'400'},
      {name:'500',   value:['500','']},
      {name:'600',   value:'600'},
      {name:'700',   value:'700'},
      {name:'800',   value:'800'},
      {name:'900',   value:'900'},
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9ThreeDigitGreys] : {
    default: '500',
    max: {value:100, saturation: 10},
    min: {value:0, saturation: 0},
    options: [
      {name:'000',   value:'000'},
      {name:'100',   value:'100'},
      {name:'200',   value:'200'},
      {name:'300',   value:'300'},
      {name:'400',   value:'400'},
      {name:'500',   value:['500','']},
      {name:'600',   value:'600'},
      {name:'700',   value:'700'},
      {name:'800',   value:'800'},
      {name:'900',   value:'900'},
      {name:'1000',   value:'1000'},
    ],
    multiplier: multiplier
  },
}

function multiplier(
  baseColor: string,
  centerIndex: number,
  index: number,
  option: ColorStepMetricOption,
  options: ColorStepMetricOption[],
  metrics: ColorStepMetrics,
) {
  const baseColorObj = new Colr().fromHex(baseColor);
  const baseHslColorObj = baseColorObj.toHsvObject();
  const topIndex = options.length-1;
  const offsetIndex = index - centerIndex;
  // above the index
  const aboveIncrementSize = topIndex - centerIndex;
  const aboveSaturationSegmentSize = Math.max(0, baseHslColorObj.s - metrics.min.saturation);
  const aboveValueSegmentSize = metrics.max.value - baseHslColorObj.v;// Math.max(36, baseHslColorObj.v - 36 );
  // below the index
  const belowIncrementSize = centerIndex;
  const belowSaturationSegmentSize = metrics.max.saturation - baseHslColorObj.s;
  const belowValueSegmentSize = Math.max(0, baseHslColorObj.v - metrics.min.value);

  // goal
  // sat: 20, val:100 -> base -> sat:100, val: 36
  // we don't want white or black, so limit the max/min
  if (offsetIndex > 0) {
    const incrementPercent = offsetIndex/aboveIncrementSize;

    // find increment of sat/val segment and add to base
    // saturation increases while value decreases...
    const saturation = baseHslColorObj.s - (aboveSaturationSegmentSize * incrementPercent);
    const value = baseHslColorObj.v + (aboveValueSegmentSize * incrementPercent);

    const finalColor = new Colr().fromHsv(baseHslColorObj.h, saturation, value);
    return finalColor.toRgbObject();
  }else if (offsetIndex < 0) {
    const incrementPercent = Math.abs(offsetIndex/belowIncrementSize);

    // find increment of sat/val segment and add to base
    // saturation decreases while value increases...
    const saturation = baseHslColorObj.s + (belowSaturationSegmentSize * incrementPercent);
    const value = baseHslColorObj.v - (belowValueSegmentSize * incrementPercent);

    const finalColor = new Colr().fromHsv(baseHslColorObj.h, saturation, value);
    return finalColor.toRgbObject();
  }
  // there could be two values...
  return baseColorObj.toRgbObject();
}