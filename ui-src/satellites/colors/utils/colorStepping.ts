import Colr from 'colr';

export enum ColorStepTypes {
  none = 'none',
  stepLightestToDarkest ='lightest-to-darkest',
  step9ThreeDigit = 'step-9-three-digit',
  step9TwoDigit = 'step-9-two-digit',
  step9OneDigit = 'step-9-one-digit',
  colorGroup = "color-group",
}

export type ColorStepMetricOption = {
  name:string,
  value:string | string[],
  multiplier?:number
}

export type ColorStepMetrics = {
  default: string,
  zeroOption: {name:string,size:0},
  options: ColorStepMetricOption[],
  multiplier: (
    baseColor: string,
    centerIndex: number,
    offsetIndex: number,
    option: ColorStepMetricOption,
    options: ColorStepMetricOption[],
  ) => string;
};

export const ColorSteps = [
  {
    name: 'Choose a Step Pattern',
    value: ColorStepTypes.none,
  },
  {
    name: 'lightest, lighter, light, [base], dark, darker, darkest',
    value: ColorStepTypes.stepLightestToDarkest,
  },
  {
    name: '1, 2, 3, 4, [base:5], 6, 7, 8, 9',
    value: ColorStepTypes.step9OneDigit,
  },
  {
    name: '10, 20, 30, 40, [base:50], 60, 70, 80, 90',
    value: ColorStepTypes.step9TwoDigit,
  },
  {
    name: '100, 200, 300, 400, [base:500], 600, 700, 800, 900',
    value: ColorStepTypes.step9ThreeDigit,
  },
  {
    name: '100, 200, 300, 400, [base:500], 600, 700, 800, 900',
    value: ColorStepTypes.step9ThreeDigit,
  },
  {
    name: 'Color Group',
    value: ColorStepTypes.colorGroup,
  },
];

export const ColorStepBaseOptions: {[key:string]:ColorStepMetrics} = 
{
  [ColorStepTypes.stepLightestToDarkest] : {
    default: '',
    zeroOption: {name:'none',size:0},
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
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9TwoDigit] : {
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
    ],
    multiplier: multiplier
  },
  [ColorStepTypes.step9ThreeDigit] : {
    default: '500',
    zeroOption: {name:'0',size:0},
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
}

function multiplier(
  baseColor: string,
  centerIndex: number,
  index: number,
  option: ColorStepMetricOption,
  options: ColorStepMetricOption[]
) {
  const baseColorObj = new Colr().fromHex(baseColor);
  const baseHslColorObj = baseColorObj.toHsvObject();
  const topIndex = options.length-1;
  const offsetIndex = index - centerIndex;
  console.log({
    baseColor,
    centerIndex,
    index,
    offsetIndex,
    topIndex,
    option,
    options
  });
  // goal
  // sat: 20, val:100 -> base -> sat:100, val: 36

  console.log('hslColor', baseHslColorObj.s, baseHslColorObj.v, offsetIndex);
  // we don't want white or black, so limit the max/min
  if (offsetIndex > 0) {
    // return baseColor * (1 + offsetIndex*.5);
    const incrementSize = topIndex - centerIndex;
    const incrementPercent = offsetIndex/incrementSize;
    // find sat/val segments
    const saturationSegmentSize = 100 - baseHslColorObj.s;
    const valueSegmentSize = Math.max(36, baseHslColorObj.v - 36 );
    // find increment of sat/val segment and add to base
    const saturation = baseHslColorObj.s + (saturationSegmentSize * incrementPercent);
    const value = baseHslColorObj.v - (valueSegmentSize * incrementPercent);
    const finalColor = new Colr().fromHsv(baseHslColorObj.h, saturation, value);
    console.log(incrementPercent, saturation, value, finalColor.toHex());
    return finalColor.toRgbObject();
  }else if (offsetIndex < 0) {
    const incrementSize = centerIndex;
    const incrementPercent = Math.abs(offsetIndex/incrementSize);
    // find sat/val segments
    const saturationSegmentSize = Math.max(20, baseHslColorObj.s - 20);
    const valueSegmentSize = 100 - baseHslColorObj.v;
    // find increment of sat/val segment and add to base
    const saturation = baseHslColorObj.s - (saturationSegmentSize * incrementPercent);
    const value = baseHslColorObj.v + (valueSegmentSize * incrementPercent);
    const finalColor = new Colr().fromHsv(baseHslColorObj.h, saturation, value);
    console.log(incrementPercent, saturation, value, finalColor.toHex());
    return finalColor.toRgbObject();
  }
  // there could be two values...
  return baseColorObj.toRgbObject();
}