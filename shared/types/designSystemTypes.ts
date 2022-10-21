import {
  DTBlurToken,
  DTBorderToken,
  DTColorToken,
  DTCubicBezierToken,
  DTDimensionToken,
  DTDurationToken,
  DTFileToken,
  DTFontFamilyToken,
  DTFontStyleToken,
  DTFontWeightToken,
  DTGradientToken,
  DTPercentToken,
  DTShadowToken,
  DTStrokeStyleToken,
  DTTransitionToken,
  DTTypographyToken
} from "./designTokenTypes";

// ROOT OBJECT
export interface DSys {
  [key: string] : DSysSheet | string
  $description: string,
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
export interface DSysSheet {
  $extensions: DSysSheetExtensions,
  $description?: string,
  colors?: DSysColorGroup,
  typography?: DSysTypographyGroup,
  effects?: DSysEffectGroup,
  icons?: DSysIconGroup,
  components?: DSysComponentsGroup,
  spacing?: DSysSpacingGroup,
  layout?: DSysLayoutGroup,
  columnLayout?: DSysColumnLayoutGroup,
  undetermined?: DSysUndeterminedGroup,
};

// ALL THE GROUPS
export enum DSysGroupType {
  Base = 'Base',
  ColorSet = 'ColorSet',
  TypographySet = 'TypographySet',
  EffectSet = 'EffectSet',
  IconSet = 'IconSet',
  ComponentSet = 'ComponentSet',
  Spacing = 'Spacing',
  LayoutSet = 'LayoutSet',
  ColumnLayoutSet = 'ColumnLayoutSet',
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

export type DSysIconGroup = DSysGroup<// todo
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

export type DSysLayoutGroup = DSysGroup<
  DSysGroupType.LayoutSet,
  DSysLayoutTokenset
>;

export type DSysColumnLayoutGroup = DSysGroup<
  DSysGroupType.ColumnLayoutSet,
  DSysColumnLayoutTokenset
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
  DSysTypographyTokenset |
  DSysEffectTokenset |
  DSysIconTokenset |
  DSysComponentsTokenset |
  DSysSpacingTokenset |
  DSysLayoutTokenset |
  DSysColumnLayoutTokenset |
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

export type DSysIconTokenset = DSysTokensetBase<// todo
  DSysGroupType.IconSet,
  DSysFileToken 
>;

export type DSysComponentsTokenset = DSysTokensetBase<// todo
  DSysGroupType.ComponentSet,
  DSysBorderToken |
  DSysColorToken |
  DSysFileToken 
>;

export type DSysSpacingTokenset = DSysTokensetBase<
  DSysGroupType.Spacing,
  DSysDimensionToken
>;

export type DSysLayoutTokenset = DSysTokensetBase<
  DSysGroupType.LayoutSet,
  DSysDimensionToken
>;

export type DSysColumnLayoutTokenset = DSysTokensetBase<
  DSysGroupType.ColumnLayoutSet,
  DSysDimensionToken
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
  DSysFileToken;

export interface DSysColorToken extends DTColorToken {
  $extensions : {
    'dsys.level'    : DSysLevel.token,
    'dsys.name'     : string,
    'dsys.index'    : number,
    'dsys.styleId'  : string,
  },
}
export interface DSysDimensionToken extends DTDimensionToken {
  $extensions : {
    'dsys.level' : DSysLevel.token,
    'dsys.name'  : string,
    'dsys.index' : number,
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

