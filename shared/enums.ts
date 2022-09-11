
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