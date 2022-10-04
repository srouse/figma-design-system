import hexToRgb from './hexToRgb';

export default function validColor(color: string) {
  const rgb = hexToRgb(color);
  return rgb && rgb.length === 3;
}

export function returnValidColor(
  color: string,
  altColor = '#eeeeee',
) {
  return validColor(color) ? color : altColor;
}