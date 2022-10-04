import hexToRgb from './hexToRgb';


export type AdaColorContrastResult = {
  whiteRatio: number,
  blackRatio: number,
  white: {
    aaSmallText: boolean,
    aaLargeText: boolean,
    aaaSmallText: boolean,
    aaaLargeText: boolean,
  },
  black: {
    aaSmallText: boolean,
    aaLargeText: boolean,
    aaaSmallText: boolean,
    aaaLargeText: boolean,
  }  
}

export default function colorContrastAda(
  color: string
) : AdaColorContrastResult | false {
  const rgb = hexToRgb(color);
  if (!rgb) return false;

  const onWhiteContrast = checkContrast(color, '#ffffff');
  const onBlackContrast = checkContrast(color, '#000000');

  /*
  // aaa -> aa lg -> aa -> nothing
  AALarge: 3,
  AASmall: 4.5,
  AAALarge: 4.5,
  AAASmall: 7, 
  */

  return {
    whiteRatio: onWhiteContrast,
    blackRatio: onBlackContrast,
    white: {
      aaSmallText: onWhiteContrast >= WCAG_RATIOS.AASmall,
      aaLargeText: onWhiteContrast >= WCAG_RATIOS.AALarge,
      aaaSmallText: onWhiteContrast >= WCAG_RATIOS.AAASmall,
      aaaLargeText: onWhiteContrast >= WCAG_RATIOS.AAALarge,
    },
    black: {
      aaSmallText: onBlackContrast >= WCAG_RATIOS.AASmall,
      aaLargeText: onBlackContrast >= WCAG_RATIOS.AALarge,
      aaaSmallText: onBlackContrast >= WCAG_RATIOS.AAASmall,
      aaaLargeText: onBlackContrast >= WCAG_RATIOS.AAALarge,
    }
  }
}


function luminance(r: number, g: number, b: number) {
  let [lumR, lumG, lumB] = [r, g, b].map(component => {
      let proportion = component / 255;
      return proportion <= 0.03928
          ? proportion / 12.92
          : Math.pow((proportion + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lumR + 0.7152 * lumG + 0.0722 * lumB;
}

function contrastRatio(luminance1: number, luminance2: number) {
  let lighterLum = Math.max(luminance1, luminance2);
  let darkerLum = Math.min(luminance1, luminance2);

  return (lighterLum + 0.05) / (darkerLum + 0.05);
}

function checkContrast(color1: string, color2: string) {
  let [luminance1, luminance2] = [color1, color2].map(color => {
      /* Remove the leading hash sign if it exists */
      color = color.startsWith("#") ? color.slice(1) : color;

      let r = parseInt(color.slice(0, 2), 16);
      let g = parseInt(color.slice(2, 4), 16);
      let b = parseInt(color.slice(4, 6), 16);

      return luminance(r, g, b);
  });

  return contrastRatio(luminance1, luminance2);
}

/**
* A utility to format ratios as nice, human-readable strings with 
* up to two digits after the decimal point (ex. "4.3:1" or "17:1")
*/
function formatRatio(ratio: number) {
  let ratioAsFloat = ratio.toFixed(2)
  let isInteger = Number.isInteger(parseFloat(ratioAsFloat))
  return `${isInteger ? Math.floor(ratio) : ratioAsFloat}:1`
}

/**
* Determine whether the given contrast ratio meets WCAG 
* requirements at any level (AA Large, AA, or AAA). In the return 
* value, `isPass` is true if the ratio meets or exceeds the minimum 
* of at least one level, and `maxLevel` is the strictest level that 
* the ratio passes.
*/
const WCAG_MINIMUM_RATIOS = [
  ['AA Large', 3],
  ['AA', 4.5],
  ['AAA Large', 4.5],
  ['AAA', 7],
]

const WCAG_RATIOS = {
  AALarge: 3,
  AASmall: 4.5,
  AAALarge: 4.5,
  AAASmall: 7, // aaa -> aa lg -> aa -> nothing
}

function meetsMinimumRequirements(ratio: number) {
  let didPass = false;
  let maxLevel: string | null = null;

  for (const [level, minRatio] of WCAG_MINIMUM_RATIOS) {
      if (ratio < minRatio) break
      didPass = true;
      maxLevel = level as string;
  }

  return { didPass, maxLevel };
}

/*
const result = `
AA-level large text: ${ratio < 1/3 ? 'PASS' : 'FAIL' }<br>
AA-level small text: ${ratio < 1/4.5 ? 'PASS' : 'FAIL' }<br>
AAA-level large text: ${ratio < 1/4.5 ? 'PASS' : 'FAIL' }<br>
AAA-level small text: ${ratio < 1/7 ? 'PASS' : 'FAIL' }
`;
*/