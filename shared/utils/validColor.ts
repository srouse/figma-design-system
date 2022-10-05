import hexToRgb from './hexToRgb';

export default function validColor(
  color: string | undefined
) : boolean {
  if (!color) return false;
  const rgb = hexToRgb(color);
  return rgb ? rgb.length === 3 : false;
}

export function returnValidColor(
  color: string,
  altColor = '#eeeeee',
) {
  return validColor(color) ? color : altColor;
}