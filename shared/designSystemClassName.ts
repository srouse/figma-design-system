import {
  DesignTokensModel,
  TokenSet
} from './types/types';
import toKebabCase from './toKebobCase';

export default function designSystemClassName(
  designTokensModel: DesignTokensModel | undefined,
  tokenset: TokenSet | undefined
) {
  if (!designTokensModel || !tokenset) {
    return '';
  }
  const prefix = designTokensModel.prefix ? 
    designTokensModel.prefix.toLowerCase() : '';
  let name = tokenset.name || '';
  name = toKebabCase(name);
  return `${prefix}-${name}-[...]`;// [area]-[step]`;
}