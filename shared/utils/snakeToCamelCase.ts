

export default function snakeToCamelCase(str: string | undefined) {
  if (!str) return '';
  return str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );
}