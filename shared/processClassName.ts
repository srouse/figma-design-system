import toKebabCase from './toKebobCase';

export default function processClassName(
  prefix: string | undefined,
  name: string | undefined,
) {
  const finalPrefix = prefix || '';
  const finalName = name || '';
  return `${finalPrefix.toLocaleLowerCase()}-${toKebabCase(finalName)}-[...]`;
}