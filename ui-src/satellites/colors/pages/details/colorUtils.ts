
export type ColorHex = {r:number, g:number, b:number};
export type ColorHsv = {h:number, s:number, v:number};

function hexToRgb(hex: string) : ColorHex {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {
    r: 0,
    g: 0,
    b: 0
  };
}

export function hexToHsv(
  hex: string
): ColorHsv  {
  const rgb = hexToRgb(hex);
  return rgbToHsv(rgb.r, rgb.g, rgb.b);
}

// 255, 255, 255
export function rgbToHsv (r:number, g:number, b:number): ColorHsv {
  let rabs, gabs, babs, rr, gg, bb, h, s, 
    v: number, diff: number, 
    diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = (c: number) => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = (num: number) => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      h = 0;
      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }
  return {
      h: Math.round(h * 360),
      s: percentRoundFn(s * 100),
      v: percentRoundFn(v * 100)
  };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
// 100, 100, 100
export function hsvToRgb(initH:number, initS:number, initV:number): ColorHex {
  const h = initH/100;
  const s = initS/100;
  const v = initV/100;
  let r, g, b;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  if (r === undefined || g === undefined || b === undefined )
    return { r: 0, g: 0, b: 0 };
  return { r: r * 255, g: g * 255, b: b * 255 };
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
// 255, 255, 255
export function rgbToHex (r: number, g: number, b: number) {
  return "#" + decToHex(r) + decToHex(g) + decToHex(b);
}

export function hsvToHex(h:number, s:number, v:number): string {
  const rgb = hsvToRgb(h,s,v);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}