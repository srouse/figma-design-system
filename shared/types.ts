import { TokenSetType } from './enums';

export interface State {
  designSystemModel?: DesignSystemModel
  nodeId?: string
  tokenset?: TokenSet
}

export interface DesignSystemModel {
  fullName?: string
  prefix?: string
  colorIdentifier?: string// for header background
  baseId: string | null
  tokensets: TokenSet[]
}

export interface TokenSet {
  type: TokenSetType
  nodeId: string
  name?: string
  sortIndex: number
}

export interface TokenSetCategory {
  type: TokenSetType,
  tokensets: TokenSet[]
}

// DesignSystemWidget
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
  setDesignSystemModel: (newValue: DesignSystemModel | ((currValue: DesignSystemModel) => DesignSystemModel)) => void;

  touch: number;
  setTouch: SetterNumber;
}

export const defaultDesignSystemModel : DesignSystemModel = {
  baseId: null,
  tokensets: []
}

export const widgetVersion = 3;