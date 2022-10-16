import {
  DTColor,
} from '../types/designTokenTypes';

export function validColor(
  color: DTColor | undefined
) : boolean {
  if (!color) return false;
  const rgb = hexToRgb(color.hex);
  return rgb ? rgb.length === 3 : false;
}

export function returnValidColor(
  color: DTColor,
  altColor = {hex: '#eeeeee', alpha: 1 },
) : DTColor {
  return validColor(color) ? color : altColor;
}

export function dtColorToCss(color: DTColor) {
  const validColor = returnValidColor(color);
  return `${validColor.hex}${
    decToHex(
      validColor.alpha * 255
    )
  }}`;
}

export function hexToRgb (
  hex: string
) : number[] | null  {
  const result = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1).match(/.{2}/g);
  if (result) {
    return result.map(x => parseInt(x, 16));
  }
  return null;
}

export function decToHex(c: number) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex (r: number, g: number, b: number) {
  return "#" + decToHex(r) + decToHex(g) + decToHex(b);
}

export function rgbFractionToHex (color: {r: number, g: number, b: number}) {
  return "#" + 
    decToHex(color.r*255) + 
    decToHex(color.g*255) + 
    decToHex(color.b*255);
}