import { CssAtomsLookup, DSysBreakpointToken, DSysSheetGroupNames } from "../../../../../../../../../shared";
import { breakpointEnd, breakpointStart } from "./breakpoints";

export function createSizeMetrics(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  _createEnforcedStyle(prefix, 'size',            ['width', 'height'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'max-size',        ['max-width', 'max-height'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'min-size',        ['min-width', 'min-height'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'width',           ['width'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'max-width',       ['max-width'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'min-width',       ['min-width'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'height',          ['height'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'max-height',      ['max-height'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'min-height',      ['min-height'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'left',            ['left'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'right',           ['right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'top',             ['top'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'bottom',          ['bottom'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'margin',          ['margin'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-left',     ['margin-left'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-right',    ['margin-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-top',      ['margin-top'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-bottom',   ['margin-bottom'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-width',    ['margin-left', 'margin-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-x',        ['margin-left', 'margin-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-height',   ['margin-top', 'margin-bottom'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'margin-y',        ['margin-top', 'margin-bottom'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'padding',         ['padding'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-left',    ['padding-left'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-right',   ['padding-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-top',     ['padding-top'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-bottom',  ['padding-bottom'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-width',   ['padding-left', 'padding-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-x',       ['padding-left', 'padding-right'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-height',  ['padding-top', 'padding-bottom'], result, '', breakpoint, cssAtomsLookup);
  _createEnforcedStyle(prefix, 'padding-y',       ['padding-top', 'padding-bottom'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'border-radius',   ['border-radius'], result, '', breakpoint, cssAtomsLookup);

  _createEnforcedStyle(prefix, 'gap',             ['--gap'], result, ' > *', breakpoint, cssAtomsLookup);

  _createStyle(prefix,         'fill',            ['flex'], result, '', breakpoint, cssAtomsLookup);
  return result.join('\n');
}

function _createEnforcedStyle(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

  result.push(`
${breakpointStart(breakpoint)}[style*="--${prefix}-${finalName}: var("]${suffix} {
  ${props.map((prop) => {
    return `${prop}: var( --${prefix}-${finalName} );`
  }).join('\n  ')}
}${breakpointEnd(breakpoint)}
`);

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.spacing,
    }
  }
}

function _createStyle(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

  result.push(`
${breakpointStart(breakpoint)}[style~="--${prefix}-${finalName}:"]${suffix} {
  ${props.map((prop) => {
    return `${prop}: var( --${prefix}-${finalName} );`
  }).join('\n  ')}
}${breakpointEnd(breakpoint)}`);

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.spacing,
    }
  }
}

