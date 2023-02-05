import {
  DSys,
  DSysGroupType,
  DSysSheetGroupNames,
  DSysTokenset
} from './designSystemTypes';

export enum MessageName {
  globalDataUpdate = 'globalDataUpdate',
  tokenGroupUpdate = 'tokenGroupUpdate',
  promiseBounce = 'promiseBounce',
}

export type DesignTokensResult = {
  tokens: DSys,
  errors: string[],
}

export type CssVarsLookup = {[key:string]: {
  category: DSysSheetGroupNames,
  value: string,
}}

export type ScssVarsLookup = {[key in DSysSheetGroupNames]?: {
  name: string,
  value: string,
}[]}

export type CssAtomsLookup = {[key:string]: {
  category: DSysSheetGroupNames | true,
}}

export type FileCreateResults = {
  tokenResults?: DesignTokensResult,
  cssVarsLookup? : CssVarsLookup,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
}

export type SelectDropDown = {
  value: string,
  name: string,
  children?: SelectDropDown[],
};

export type MessagePromiseResult = {
  request: MessageRequest,
  promiseId: string,
  [key: string]: any,
}

export enum MessageRequest {
  globalDataUpdate = 'globalDataUpdate',
  stateUpdate = 'stateUpdate',
  getStyles = 'getStyles',
  getColorStyles = 'getColorStyles',
  getTextStyles = 'getTextStyles',
  getEffectStyles = 'getEffectStyles',
  getFinalTokens = 'getFinalTokens',
  createStyle = 'createStyle',
  deleteStyle = 'deleteStyle',
  updateStyle = 'updateStyle',
  moveStyle = 'moveStyle',
  notify = 'notify',
  refreshTokensFromStyles = 'refreshTokensFromStyles',
  changeStylesFolder = 'changeStylesFolder',
  updateTokenGroup = 'updateTokenGroup',
  getAvailableFonts = 'getAvailableFonts',

  // icons
  createIconFromSVG = 'createIconFromSVG',
  createIconFromSelection = 'createIconFromSelection',
  changeIconCompName = 'changeIconCompName',
  setFontAwesomeAPIKey = 'setFontAwesomeAPIKey',
  setFontAwesomeStyle = 'setFontAwesomeStyle',
  setFontAwesomeKit = 'setFontAwesomeKit',
  refreshIconTokens = 'refreshIconTokens',
  deleteIcon = 'deleteIcon',
  changeIconTokenName = 'changeIconTokenName',
  setIconSizes = 'setIconSizes',
  setIconScale = 'setIconScale',
  setIconOffsetX = 'setIconOffsetX',
  setIconOffsetY = 'setIconOffsetY',

  // component
  getComponentList = 'getComponentList',
  focusOnComponent = 'focusOnComponent',
  focusOnComponentToken = 'focusOnComponentToken',
  getComponentScss = 'getComponentScss',

  // base
  getCategorizedTokenGroups = 'getCategorizedTokenGroups',
  focusOnToken = 'focusOnToken',
}

export enum MessageRequestStyle {
  color = 'color',
  text = 'text',
  effect = 'effect',
  shadow = 'shadow',
  blur = 'blur',
}

export type Result = {
  success: boolean,
  message?: string,
}

// ---------- UI -----------------
export interface State {
  nodeId?: string, // the id of this widget's node
  tokenGroup?: TokenGroup,
  globalData?: GlobalData,
  dsysTokens?: DSys,
  promptTitle?: string,
  promptContent?: any,
  fontAwesomeApiKey?: string,
  fontAwesomeKit?: string,
  iconSizes?: number[],
}

export type CoreProps = {
  tokenGroup?: TokenGroup,
  globalData?: GlobalData,
  updateGlobalData: (globalData: GlobalData) => void,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
  refreshTokens: () => void,
  createPrompt: (title: string, content: any) => void,
  closePrompt: () => void,
  style?: {},
  fontAwesomeApiKey?: string,
  updateFontAwesomeApiKey: (fontAwesomeApiKey: string) => Promise<string>,
  fontAwesomeKit?: string,
  updateFontAwesomeKit: (fontAwesomeKit: string) => Promise<string>,
  iconSizes?: number[],
  updateIconSizes: (iconSizes: number[]) => Promise<number[]>,
}

export interface GlobalData {
  prefix: string,
  fullName: string,
  gitHubSettings: GitHubSettings
}

export type GitHubSettings = {
  username?: string,
  repositoryAndNPMPackageName?: string,
  accessToken?: string,
  version: string,// semvar
  connected: boolean,
  deployed: boolean,
}

export interface TokenGroup {
  type: DSysGroupType,
  nodeId: string,
  name?: string,
  steps? : string,
  // all the various widgets are responsible for well formatted DSysTokensets
  tokensets: DSysTokenset[];
}

export type TokenGroupLookup = {
  nodeId: string,
  tokenGroupName: string | undefined,
  tokenGroupType: string | undefined,
}

export type TokenGroupCategorizedLookup = {
  colors: TokenGroupLookup[],
  typography: TokenGroupLookup[],
  effects: TokenGroupLookup[],
  icons: TokenGroupLookup[],
  breakpoints: TokenGroupLookup[],
  custom: TokenGroupLookup[],
  spacing: TokenGroupLookup[],
  components: TokenGroupLookup[],
}

// ============== DEFAULTS ====================

export const defaultTokenGroup : TokenGroup = {
  type: DSysGroupType.Undetermined,
  name: '',
  nodeId: 'not set',
  tokensets: [],
}

export const defaultGlobalData: GlobalData = {
  prefix: '',
  fullName: '',
  gitHubSettings: {
    version: '0.0.0',
    connected: false,
    deployed: false,
  }
}

export const defaultTokenGroupLookup: TokenGroupLookup[] = [];

export const defaultTokenGroupCategorizedLookup: TokenGroupCategorizedLookup = {
  colors: [],
  typography: [],
  effects: [],
  icons: [],
  breakpoints: [],
  custom: [],
  spacing: [],
  components: [],
};

export const widgetVersion = 3;


// ========== DesignSystemWidget ========================
export interface SetterString {
  (newValue: string | ((currValue: string) => string)): void;
}

export interface SetterNumber {
  (newValue: number | ((currValue: number) => number)): void
}

export interface SetterBoolean {
  (newValue: boolean | ((currValue: boolean) => boolean)): void
}

export interface SetterStringArray {
(newValue: never[] | ((currValue: never[]) => never[])): void
}

export interface DesignSystemWidget {
  nodeId: string;
  globalData: GlobalData;
  touch: number;
  setTouch: SetterNumber;
}

// ============= FIGMA ======
export type FigmaPaintStyle = {
  id: string,
  name: string,
  type: 'PAINT',
  paints: readonly {
    blendMode: 'NORMAL',
    color: {
      r: number,
      g: number,
      b: number,
    },
    opacity: number,
    type: 'SOLID',
    visible: boolean,
  }[]
}

export type FigmaEffectStyle = {
  id: string,
  name: string,
  type: 'EFFECT',
  effects: readonly {
    blendMode: 'NORMAL',
    color: {r:number, g:number, b:number, a:number},
    offset: {x:number, y:number},
    radius: number,
    spread: number,
    type: 'DROP_SHADOW' | 'LAYER_BLUR',
  }[]
}

export type FigmaTextStyle = {
  id: string,
  name: string,
  type: 'TEXT',
  fontName: {
    readonly family: string
    readonly style: string
  },
  fontSize: number,
  letterSpacing: FigmaLetterSpacing,
  lineHeight: FigmaLineHeight,
  listSpacing: number,
  paragraphIndent: number,
  paragraphSpacing: number,
  textCase: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE',
  textDecoration: 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH',
}

export type FigmaLetterSpacing = {
  readonly value: number,
  readonly unit: 'PIXELS' | 'PERCENT',
};

export type FigmaLineHeight = {
  readonly value: number,
  readonly unit: 'PIXELS' | 'PERCENT' | 'AUTO',
} | {
  readonly unit: 'AUTO',
};

// =========START V1======================
// ----------- WIDGET --------------
export interface DesignTokensModel {
  fullName?: string,
  prefix?: string,
  colorIdentifier?: string,// for header background
  baseId: string | null,
  tokensets: TokenSet[],
}

  export interface TokenSet {
    type: TokenSetType,
    nodeId: string,
    name?: string,
  }
  export enum TokenSetType {
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

// ======= A UI CONSTRUCT ========
export interface TokenSetCategory {
  type: TokenSetType,
  tokensets: TokenSet[]
}
// =========END V1======================
