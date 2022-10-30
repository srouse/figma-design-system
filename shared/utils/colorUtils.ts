import {
  DTColor,
} from '../types/designTokenTypes';

/**
 * validColor
 */
export function validColor(
  color: DTColor | undefined
) : boolean {
  if (!color) return false;
  const rgb = hexToRgb(color.hex);
  return rgb ? rgb.length === 3 : false;
}

/**
 * returnValidColor 
 */
export function returnValidColor(
  color: DTColor,
  altColor = {hex: '#eeeeee', alpha: 1 },
) : DTColor {
  return validColor(color) ? color : altColor;
}

/**
 * dtColorToCss
 */
export function dtColorToCss(color: DTColor) {
  const validColor = returnValidColor(color);
  return `${validColor.hex}${
    decToHex(
      validColor.alpha * 255
    )
  }}`;
}

/**
 * hexToRgb 
 */
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

/**
 * RGBType
 */
export enum RGBType {
  base255 = 'base255',
  base1 = 'base1',
}

/**
 * hexToRgbObj
 */
export function hexToRgbObj (
  hex: string,
  base: RGBType = RGBType.base255,
) : {r:number, g:number, b:number}  {
  const rgbArr = hexToRgb(hex);
  if (!rgbArr || rgbArr.length < 3) {
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }
  if (base === RGBType.base255) {
    return {
      r: rgbArr[0],
      g: rgbArr[1],
      b: rgbArr[2]
    };
  }else{
    return {
      r: rgbArr[0]/255,
      g: rgbArr[1]/255,
      b: rgbArr[2]/255
    };
  }
}

/**
 * hexAndAlphaToRGBAObj
 */
export function hexAndAlphaToRGBAObj(
  hex: string,
  alpha: number,
  base: RGBType = RGBType.base255,
) {
  const rgbObj = hexToRgbObj(hex, base);
  return {
    r: rgbObj.r,
    g: rgbObj.g,
    b: rgbObj.b,
    a: alpha,
  }
}

/**
 * decToHex
 */
export function decToHex(c: number) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

/**
 * rgbToHex
 */
export function rgbToHex (r: number, g: number, b: number) {
  return "#" + decToHex(r) + decToHex(g) + decToHex(b);
}

/**
 * rgbFractionToHex
 */
export function rgbFractionToHex (color: {r: number, g: number, b: number}) {
  return "#" + 
    decToHex(color.r*255) + 
    decToHex(color.g*255) + 
    decToHex(color.b*255);
}

/**
 * hexAlphaToCss
 */
export function hexAlphaToCss(
  hex: string,
  alpha: number
) {
  const rgbObj = hexToRgbObj(hex);
  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${alpha.toFixed(3)})`;
}