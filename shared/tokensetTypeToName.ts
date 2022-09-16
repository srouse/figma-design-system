import { TokenSetType } from './types/types';
import {
  TokenSet, TokenSetCategory
} from './types/types';

export default function tokensetTypeToName(
  tokenset: TokenSet | TokenSetCategory) {
  switch (tokenset.type) {
    case TokenSetType.Base:
      return 'Base';
    case TokenSetType.ColorSet:
      return 'Colors';
    case TokenSetType.TypographySet:
      return 'Typography';
    case TokenSetType.IconSet:
      return 'Icons';
    case TokenSetType.EffectSet:
      return 'Effects';
    case TokenSetType.ComponentSet:
      return 'Components';
    case TokenSetType.Spacing:
      return 'Spacing';
    case TokenSetType.LayoutSet:
      return 'Layouts';
    case TokenSetType.ColumnLayoutSet:
      return 'Column Layouts';
    default:
      return tokenset.type;
  }
}