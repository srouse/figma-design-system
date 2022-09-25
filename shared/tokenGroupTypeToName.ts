import { DSysGroupType } from './types/designSystemTypes';
import {
  TokenGroup
} from './types/types';


export default function tokenGroupTypeToName(
  tokenGroup: TokenGroup | undefined
) {
  if (!tokenGroup) return 'No Token Group Found';
  switch (tokenGroup.type) {
    case DSysGroupType.Base:
      return 'Base';
    case DSysGroupType.ColorSet:
      return 'Colors';
    case DSysGroupType.TypographySet:
      return 'Typography';
    case DSysGroupType.IconSet:
      return 'Icons';
    case DSysGroupType.EffectSet:
      return 'Effects';
    case DSysGroupType.ComponentSet:
      return 'Components';
    case DSysGroupType.Spacing:
      return 'Spacing';
    case DSysGroupType.LayoutSet:
      return 'Layouts';
    case DSysGroupType.ColumnLayoutSet:
      return 'Column Layouts';
    default:
      return tokenGroup.type;
  }
}