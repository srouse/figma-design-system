export const designTokenTypes = `
type DTTokenBase = {
  $extension?: any,
  $description? : string,
}

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
  custom = 'custom',
  breakpoint = 'breakpoint',
  dimension = 'dimension',
  spacing = 'spacing',
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
  svg = 'svg',
  component = 'component',
}

// Color
export interface DTColorToken extends DTTokenBase {
  '$value' : DTColor,
  '$type' : DTTokenType.color
}

export type DTColor = {
  hex: string,
  alpha: number,
};

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

// Blur
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

// Spacing
export interface DTSpacingToken extends DTTokenBase {
  '$value': number,
  '$type' : DTTokenType.spacing
}

// Custom
export interface DTCustomToken extends DTTokenBase {
  '$value': string,
  '$type' : DTTokenType.custom
}

// Breakpoint
export interface DTBreakpointToken extends DTTokenBase {
  '$value': number,
  '$direction': 'up' | 'down',
  '$type' : DTTokenType.breakpoint,
}

// Typography
export type FontName = {
  family: string,
  style: string,
};

export type LineHeight = {
  value: number,
  unit: 'PIXELS' | 'PERCENT'
} | { unit: 'AUTO' };

export type LetterSpacing = {
  value: number,
  unit: 'PIXELS' | 'PERCENT',
}

export interface DTTypographyToken extends DTTokenBase {
  '$value': {
    'fontFamily': string,
    'figmaFontObj' : FontName,
    'fontWeight': DTFontWeightTokenValues,
    'fontStyle': string,
    'fontSize': number,
    'letterSpacing': LetterSpacing,
    'lineHeight': LineHeight,
    'listSpacing': number,
    'paragraphIndent': number,
    'paragraphSpacing': number,
    'textCase': 'ORGINAL' | 'UPPER' | 'LOWER' | 'TITLE',
    'textDecoration': 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH',
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
  100	| 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

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

// Component
export interface DTComponentToken extends DTTokenBase {
  '$value': string,// id of figma component...
  '$type' : DTTokenType.component
}

// Svg
export interface DTSvgToken extends DTTokenBase {
  '$value': {
    svg: string,
    // style: 'regular' | string,
    sizes: number[],
  },
  '$type' : DTTokenType.svg
}

`;

export const designSystemTypes = `import {
  DTBlurToken,
  DTBorderToken,
  DTBreakpointToken,
  DTColorToken,
  DTComponentToken,
  DTCubicBezierToken,
  DTCustomToken,
  DTDimensionToken,
  DTDurationToken,
  DTFileToken,
  DTFontFamilyToken,
  DTFontStyleToken,
  DTFontWeightToken,
  DTGradientToken,
  DTPercentToken,
  DTShadowToken,
  DTSpacingToken,
  DTStrokeStyleToken,
  DTSvgToken,
  DTTransitionToken,
  DTTypographyToken
} from "./designTokenTypes";

// ROOT OBJECT
export interface DSys {
  [key: string] : DSysSheet | string
  $description: string,
};

export interface DSysSheet {
  $extensions: DSysSheetExtensions,
  $description?: string,
  [DSysSheetGroupNames.color]?: DSysColorGroup,
  [DSysSheetGroupNames.type]?: DSysTypographyGroup,
  [DSysSheetGroupNames.effect]?: DSysEffectGroup,
  [DSysSheetGroupNames.icons]?: DSysIconGroup,
  [DSysSheetGroupNames.component]?: DSysComponentsGroup,
  [DSysSheetGroupNames.custom]?: DSysCustomGroup,
  [DSysSheetGroupNames.breakpoint]?: DSysBreakpointGroup,
  [DSysSheetGroupNames.spacing]?: DSysSpacingGroup,
  [DSysSheetGroupNames.undetermined]?: DSysUndeterminedGroup,
};

export enum DSysLevel {
  sheet =     'sheet',
  group =     'group',
  tokenset =  'tokenset',
  token =     'token'
}

// DSYS SHEET
interface DSysSheetExtensions {
  'dsys.level'    : DSysLevel.sheet,
  'dsys.prefix'   : string,
  'dsys.fullName' : string,
  'dsys.baseId'   : string,
}

export enum DSysSheetGroupNames {
  color           = 'color',
  type            = 'type',
  effect          = 'effect',
  icons           = 'icon',
  component       = 'component',
  custom          = 'custom',
  breakpoint      = 'breakpoint',
  spacing         = 'spacing',
  undetermined    = 'undetermined',
}

// ALL THE GROUPS
export enum DSysGroupType {
  Base = 'Base',
  BreakpointSet = 'BreakpointSet',
  ColorSet = 'ColorSet',
  ComponentSet = 'ComponentSet',
  CustomSet = 'CustomSet',
  EffectSet = 'EffectSet',
  IconSet = 'IconSet',
  Spacing = 'Spacing',
  TypographySet = 'TypographySet',
  Undetermined = 'Undetermined'
}

export type DSysColorGroup = DSysGroup<
  DSysGroupType.ColorSet,
  DSysColorTokenset
>;

export type DSysTypographyGroup = DSysGroup<
  DSysGroupType.TypographySet,
  DSysTypographyTokenset
>;

export type DSysEffectGroup = DSysGroup<
  DSysGroupType.EffectSet,
  DSysEffectTokenset
>;

export type DSysIconGroup = DSysGroup<
  DSysGroupType.IconSet,
  DSysIconTokenset 
>;

export type DSysComponentsGroup = DSysGroup<// todo
  DSysGroupType.ComponentSet,
  DSysComponentsTokenset
>;

export type DSysSpacingGroup = DSysGroup<
  DSysGroupType.Spacing,
  DSysSpacingTokenset
>;

export type DSysCustomGroup = DSysGroup<
  DSysGroupType.CustomSet,
  DSysCustomTokenset
>;

export type DSysBreakpointGroup = DSysGroup<
  DSysGroupType.BreakpointSet,
  DSysBreakpointTokenset
>;

export type DSysUndeterminedGroup = DSysGroup<
  DSysGroupType.Undetermined,
  DSysUndeterminedTokenset
>;

// ---------- GROUP -----------------------
interface DSysGroupExtensions<GroupType> {
  'dsys.level'  : DSysLevel.group,
  'dsys.type'   : GroupType,
  'dsys.nodeIds' : string[],
}
export interface DSysGroup<GroupType, Tokenset> {
  [key: string] : 
    string | undefined |
    DSysGroupExtensions<GroupType> | 
    Tokenset,
  $extensions: DSysGroupExtensions<GroupType>,
  $description?: string,
}


// ============= VALUE SETS ======================
export type DSysTokenset = 
  DSysColorTokenset |
  DSysCustomTokenset |
  DSysBreakpointTokenset |
  DSysTypographyTokenset |
  DSysEffectTokenset |
  DSysIconTokenset |
  DSysComponentsTokenset |
  DSysSpacingTokenset |
  DSysUndeterminedTokenset;

export type DSysColorTokenset = DSysTokensetBase<
  DSysGroupType.ColorSet,
  DSysColorToken
>;

export type DSysTypographyTokenset = DSysTokensetBase<
  DSysGroupType.TypographySet,
  DSysFontFamilyToken |
  DSysFontWeightToken |
  DSysTypographyToken |
  DSysFontStyleToken
>;

export type DSysEffectTokenset = DSysTokensetBase<
  DSysGroupType.EffectSet,
  DSysShadowToken |
  DSysBlurToken
>;

export type DSysIconTokenset = DSysTokensetBase<
  DSysGroupType.IconSet,
  DSysSvgToken 
>;

export type DSysCustomTokenset = DSysTokensetBase<
  DSysGroupType.CustomSet,
  DSysCustomToken 
>;

export type DSysBreakpointTokenset = DSysTokensetBase<
  DSysGroupType.BreakpointSet,
  DSysBreakpointToken 
>;

export type DSysComponentsTokenset = DSysTokensetBase<
  DSysGroupType.ComponentSet,
  DSysComponentToken
>;

export type DSysSpacingTokenset = DSysTokensetBase<
  DSysGroupType.Spacing,
  DSysSpacingToken
>;

export type DSysUndeterminedTokenset = DSysTokensetBase<
  DSysGroupType.Undetermined,
  DSysDimensionToken
>;


// -------- TOKENSET -------
interface DSysTokensetBaseExtensions<GroupType> {
  'dsys.level'  : DSysLevel.tokenset,
  'dsys.type'   : GroupType,
  'dsys.name'   : string,
  'dsys.nodeId' : string,// there is only one...
}
export interface DSysTokensetBase<GroupType, TokenType> {
  [key: string] : 
    string | undefined |
    DSysTokensetBaseExtensions<GroupType> | 
    TokenType
  $extensions: DSysTokensetBaseExtensions<GroupType>,
  $description?: string,
}

// ================================================


// GENERIC TOKENS TO DSYS TOKENS
export type DSysToken = 
  DSysColorToken |
  DSysCustomToken |
  DSysBreakpointToken |
  DSysDimensionToken |
  DSysTypographyToken |
  DSysFontFamilyToken |
  DSysFontWeightToken |
  DSysFontStyleToken |
  DSysStrokeStyleToken |
  DSysBorderToken |
  DSysDurationToken |
  DSysCubicBezierToken |
  DSysShadowToken |
  DSysBlurToken |
  DSysTransitionToken |
  DSysGradientToken |
  DSysPercentToken |
  DSysFileToken |
  DSysSvgToken |
  DSysComponentToken |
  DSysSpacingToken;

export interface DSysColorToken extends DTColorToken {
  $extensions : {
    'dsys.level'    : DSysLevel.token,
    'dsys.name'     : string,
    'dsys.index'    : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysCustomToken extends DTCustomToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.uid'  : string,
  },
}
export interface DSysBreakpointToken extends DTBreakpointToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.uid'  : string,
  },
}
export interface DSysDimensionToken extends DTDimensionToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.uid'  : string,
  },
}
export interface DSysTypographyToken extends DTTypographyToken {
  $extensions : {
    'dsys.level'    : DSysLevel.token,
    'dsys.name'     : string,
    'dsys.index'    : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysFontFamilyToken extends DTFontFamilyToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysFontWeightToken extends DTFontWeightToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysFontStyleToken extends DTFontStyleToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysStrokeStyleToken extends DTStrokeStyleToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysBorderToken extends DTBorderToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysDurationToken extends DTDurationToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysCubicBezierToken extends DTCubicBezierToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysShadowToken extends DTShadowToken {
  $extensions : {
    'dsys.level'    : DSysLevel.token,
    'dsys.name'     : string,
    'dsys.index'    : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysBlurToken extends DTBlurToken {
  $extensions : {
    'dsys.level'    : DSysLevel.token,
    'dsys.name'     : string,
    'dsys.index'    : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysTransitionToken extends DTTransitionToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysGradientToken extends DTGradientToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysPercentToken extends DTPercentToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}
export interface DSysFileToken extends DTFileToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}

export interface DSysComponentToken extends DTComponentToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
  },
}

export interface DSysSvgToken extends DTSvgToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.componentId' : string,
    'dsys.scale' : number,
    'dsys.offsetX' : number,
    'dsys.offsetY' : number,
    'dsys.sizes' : number[],
    'dsys.index' : number,
  },
}

export interface DSysSpacingToken extends DTSpacingToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
    'dsys.uid'  : string,
  },
}

`;
