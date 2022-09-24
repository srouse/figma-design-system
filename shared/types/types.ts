import {
  DSys,
  DSysGroupType,
  DSysTokenset
} from './designSystemTypes';

export enum MessageTypes {
  globalDataUpdate = 'globalDataUpdate',
  tokenGroupUpdate = 'tokenGroupUpdate',
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
}

export interface GlobalData {
  prefix: string,
  fullName: string,
}

export interface TokenGroup {
  type: DSysGroupType,
  // nodeId: string,
  name?: string,
  // all the various widgets are responsible for well formatted DSysTokensets
  tokensets: DSysTokenset[];
}

export type TokenGroupLookup = {
  widgetId: string,
  tokenGroupName: string | undefined,
}

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
  
  /*
  designTokensModel: DesignTokensModel;
  setDesignTokensModel: (
    newValue: DesignTokensModel | 
    ((currValue: DesignTokensModel) => DesignTokensModel)) => void;
  */

  globalData: GlobalData;

  touch: number;
  setTouch: SetterNumber;
}

// ============== DEFAULTS ====================

export const defaultTokenGroup : TokenGroup = {
  type: DSysGroupType.Undetermined,
  name: '',
  tokensets: [],
}

export const defaultGlobalData: GlobalData = {
  prefix: '',
  fullName: '',
}

export const defaultTokenGroupLookup: TokenGroupLookup[] = [];

export const widgetVersion = 3;



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