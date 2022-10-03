import {
  DSys,
  DSysGroupType,
  DSysTokenset
} from './designSystemTypes';

export enum MessageName {
  globalDataUpdate = 'globalDataUpdate',
  tokenGroupUpdate = 'tokenGroupUpdate',
  promiseBounce = 'promiseBounce',
}

export enum MessageRequest {
  stateUpdate = 'stateUpdate',
  getStyles = 'getStyles',
  getColorStyles = 'getColorStyles',
  getTextStyles = 'getTextStyles',
  getEffectStyles = 'getEffectStyles',
  getFinalTokens = 'getFinalTokens',
  createStyle = 'createStyle',
}

export enum MessageRequestStyle {
  color = 'color',
  text = 'text',
  effect = 'effect',
}

// ---------- UI -----------------
export interface State {
  nodeId?: string, // the id of this widget's node
  tokenGroup?: TokenGroup,
  globalData?: GlobalData,
  dsysTokens?: DSys,
}

export type CoreProps = {
  tokenGroup?: TokenGroup,
  globalData?: GlobalData,
  updateGlobalData: (globalData: GlobalData) => void,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
  style?: {},
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
  widgetId: string,
  tokenGroupName: string | undefined,
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
  }
}

export const defaultTokenGroupLookup: TokenGroupLookup[] = [];

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