
export type DTToken =
  DTColorToken |
  DTDimensionToken |
  DTTypographyToken |
  DTFontFamilyToken |
  DTFontWeightToken |
  DTFontStyleToken |
  DTStrokeStyleToken |
  DTBorderToken |
  DTDurationToken |
  DTCubicBezierToken |
  DTShadowToken |
  DTTransitionToken |
  DTGradientToken |
  DTPercentToken |
  DTFileToken;

export enum DTTokenType {
  color = 'color',
  dimension = 'dimension',
  typography = 'typography',
  fontFamily = 'fontFamily',
  fontWeight = 'fontWeight',
  fontStyle = 'fontStyle',
  strokeStyle = 'strokeStyle',
  border = 'border', 
  duration = 'duration',
  cubicBezier = 'cubicBezier',
  shadow = 'shadow',
  blur = 'blur',
  transition = 'transition',
  gradient = 'gradient',
  percent = 'percent',
  file = 'file',
}

type DTTokenBase = {
  $description? : string,
}

export type DTColor = {
  hex: string,
  alpha: number,
};

// Color
export interface DTColorToken extends DTTokenBase {
  // '$value': string,
  '$value' : DTColor,
  '$type' : DTTokenType.color
}

// Shadow
export interface DTShadowToken extends DTTokenBase {
  '$value': 
    {
      'color'   : string,
      'alpha'   : number,
      'offsetX' : number,
      'offsetY' : number,
      'radius'  : number,
      'blur'    : number,
      'spread'  : number,
    },
  '$type' : DTTokenType.shadow
}

// blur
export interface DTBlurToken extends DTTokenBase {
  '$value': 
    {
      'radius'    : number,
    },
  '$type' : DTTokenType.blur
}

// Border
export interface DTBorderToken extends DTTokenBase {
  '$value': 
    {
      'color': string,
      'width': string,
      'style': DTStrokeStyleTokenValues
    }
  '$type' : DTTokenType.border
};

// Stroke Style
export interface DTStrokeStyleToken extends DTTokenBase {
  '$value': DTStrokeStyleTokenValues,
  '$type' : DTTokenType.strokeStyle
}
export type DTStrokeStyleTokenValues = 
  'solid' | 'dashed' | 'dotted' | 'double' |
  'groove' | 'ridge' | 'outset' | 'inset' |
  {
    'dashArray': string[],
    'lineCap': 'round'
  };

// Transition
export interface DTTransitionToken extends DTTokenBase {
  '$value': 
    {
      'duration': string,
      'delay': string,
      'timingFunction': number[]
    },
  '$type' : DTTokenType.transition
}

// Gradient
export interface DTGradientToken extends DTTokenBase {
  '$value': 
    {'color': string, 'postion': number}[],
  '$type' : DTTokenType.gradient
}

// Dimension
export interface DTDimensionToken extends DTTokenBase {
  '$value': string,
  '$type' : DTTokenType.dimension
}

// Typography
export interface DTTypographyToken extends DTTokenBase {
  '$value': {
    'fontFamily': string,
    'fontSize': string,
    'fontWeight': DTFontWeightTokenValues,
    'letterSpacing'?: string,
    'lineHeight'?: string,
  },
  '$type' : DTTokenType.typography
}

// Font Family
export interface DTFontFamilyToken extends DTTokenBase {
  '$value': string,
  '$type' : DTTokenType.fontFamily
}

// Font Weight
export type DTFontWeightTokenValues = 
  100	| 200 | 300 | 400 | 500 | 600 | 700 | 800 | 950 |
  'thin' | 'hairline' | 'extra-light' | 'ultra-light' |
  'light' | 'normal' | 'regular' | 'book' | 'medium' |
  'semi-bold' | 'demi-bold' | 'bold' | 'extra-bold' |
  'ultra-bold' | 'black' | 'heavy' | 'extra-black' | 'ultra-black'
export interface DTFontWeightToken extends DTTokenBase {
  '$value': DTFontWeightTokenValues,
  '$type' : DTTokenType.fontWeight
}

// Font Style
export interface DTFontStyleToken extends DTTokenBase {
  '$value': string,// to do 'normal', etc...
  '$type' : DTTokenType.fontStyle
}

// Cubic Bezier
export interface DTCubicBezierToken extends DTTokenBase {
  '$value': number[],
  '$type' : DTTokenType.cubicBezier
}

// Percent
export interface DTPercentToken extends DTTokenBase {
  '$value': number,
  '$type' : DTTokenType.percent
}

// Duration
export interface DTDurationToken extends DTTokenBase {
  '$value': string,
  '$type' : DTTokenType.duration
}

// File
export interface DTFileToken extends DTTokenBase {
  '$value': {
    url: string,
    mime: string,
  },
  '$type' : DTTokenType.file
}

