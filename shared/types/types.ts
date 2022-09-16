import {
  DSys,
  DSysGroupType,
  DSysTokenset
} from './designSystemTypes';
import { DTToken } from './designTokenTypes';

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
  designSystemModel?: DesignSystemModel, // everything, base is source of truth
  nodeId?: string, // the id of this widget's node
  tokenset?: TokenSet, // pulled from dSysModel, easier to work with locally
  dsysTokens?: DSys,
}

export interface DesignSystemModel {
  fullName?: string,
  prefix?: string,
  colorIdentifier?: string,// for header background
  baseId: string | null,
  tokensets: TokenSet[],

  tokenGroups?: TokenGroup[],// will take over tokensets...
}

  export interface TokenSet {
    type: TokenSetType,
    nodeId: string,
    name?: string,
    sortIndex: number,
    values?: string[];
  }

  export interface TokenGroup {
    type: DSysGroupType,
    nodeId: string,
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
  
  designSystemModel: DesignSystemModel;
  setDesignSystemModel: (
    newValue: DesignSystemModel | 
    ((currValue: DesignSystemModel) => DesignSystemModel)) => void;

  touch: number;
  setTouch: SetterNumber;
}

// ============== DEFAULTS ====================

export const defaultDesignSystemModel : DesignSystemModel = {
  baseId: null,
  tokensets: [],
}

export const widgetVersion = 3;
