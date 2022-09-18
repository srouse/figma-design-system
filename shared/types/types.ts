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

export interface State {
  designTokensModel?: DesignTokensModel, // everything, base is source of truth
  nodeId?: string, // the id of this widget's node
  tokenset?: TokenSet, // pulled from dSysModel, easier to work with locally
  dsysTokens?: DSys,
}

export interface DesignTokensModel {
  fullName?: string,
  prefix?: string,
  colorIdentifier?: string,// for header background
  baseId: string | null,
  tokensets: TokenSet[],

  tokenGroups?: TokenGroup[],// will take over tokensets...
}

  // TODO: Change TokenSet to "TokenGroup" and store tokensets within each widget
  export interface TokenGroup {
    type: DSysGroupType,
    // nodeId: string,
    name?: string,
    // all the various widgets are responsible for well formatted DSysTokensets
    tokensets: DSysTokenset[];
  }

  export interface TokenSet {
    type: TokenSetType,
    nodeId: string,
    name?: string,
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

export const widgetVersion = 3;
