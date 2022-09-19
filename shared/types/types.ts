import {
  DSys,
  DSysGroupType,
  DSysTokenset
} from './designSystemTypes';

export enum MessageTypes {
  modelUpdate = 'modelUpdate',
  modelUpdateAndClose = 'modelUpdateAndClose',
  tokenSetTypeChange = 'tokenSetTypeChange',
}

// =========START V1======================

// ---------- UI -----------------
export interface State {
  designTokensModel?: DesignTokensModel, // everything, base is source of truth
  nodeId?: string, // the id of this widget's node
  tokenset?: TokenSet, // pulled from dSysModel, easier to work with locally
  dsysTokens?: DSys,
}

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
// =========END V1======================

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

// ======= A UI CONSTRUCT ========
export interface TokenSetCategory {
  type: TokenSetType,
  tokensets: TokenSet[]
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
  
  designTokensModel: DesignTokensModel;
  setDesignTokensModel: (
    newValue: DesignTokensModel | 
    ((currValue: DesignTokensModel) => DesignTokensModel)) => void;

  touch: number;
  setTouch: SetterNumber;
}

// ============== DEFAULTS ====================
export const defaultDesignTokensModel : DesignTokensModel = {
  baseId: null,
  tokensets: [],
}

export const defaultTokenGroup : TokenGroup = {
  type: DSysGroupType.Undetermined,
  name: '',
  tokensets: [],
}

export const defaultGlobalData: GlobalData = {
  prefix: '',
  fullName: '',
}

export const widgetVersion = 3;
