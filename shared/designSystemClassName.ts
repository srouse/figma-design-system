import {
  DesignSystemModel,
  TokenSet
} from './types';
import toKebabCase from './toKebobCase';

export default function designSystemClassName(
  designSystemModel: DesignSystemModel | undefined,
  tokenset: TokenSet | undefined
) {
  if (!designSystemModel || !tokenset) {
    return '';
  }
  const prefix = designSystemModel.prefix ? 
    designSystemModel.prefix.toLowerCase() : '';
  let name = tokenset.name || '';
  name = toKebabCase(name);
  return `${prefix}-${name}-[...]`;// [area]-[step]`;
}