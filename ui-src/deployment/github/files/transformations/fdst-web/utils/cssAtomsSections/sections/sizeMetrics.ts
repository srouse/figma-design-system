import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames,
  ScssVarsLookup,
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import {
  breakpointEnd,
  breakpointStart,
} from "./breakpoints";

export function createSizeMetrics(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();

  const _createFunk = isScss ? _createMixin : _createAtom;

  _createFunk(prefix, 'size',            ['width', 'height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'max-size',        ['max-width', 'max-height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'min-size',        ['min-width', 'min-height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'width',           ['width'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'max-width',       ['max-width'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'min-width',       ['min-width'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'height',          ['height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'max-height',      ['max-height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'min-height',      ['min-height'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'left',            ['left'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'right',           ['right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'top',             ['top'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'bottom',          ['bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'margin',          ['margin'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-left',     ['margin-left'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-right',    ['margin-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-top',      ['margin-top'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-bottom',   ['margin-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-width',    ['margin-left', 'margin-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-x',        ['margin-left', 'margin-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-height',   ['margin-top', 'margin-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'margin-y',        ['margin-top', 'margin-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'padding',         ['padding'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-left',    ['padding-left'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-right',   ['padding-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-top',     ['padding-top'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-bottom',  ['padding-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-width',   ['padding-left', 'padding-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-x',       ['padding-left', 'padding-right'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-height',  ['padding-top', 'padding-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'padding-y',       ['padding-top', 'padding-bottom'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'border-radius',   ['border-radius'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix, 'gap',             ['--gap'], result, ' > *', breakpoint, cssAtomsLookup, scssVarsLookup);

  _createFunk(prefix,         'fill',            ['flex'], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  return result.join('\n');
}

// ===== CSS ===================================================================
function _createAtom(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
  const propName = `--${prefix}-${finalName}`;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(`[style~="${propName}:"]${suffix}`);
  props.map((prop) => {
    bracketStr.addEntry(`${prop}: var( ${propName} );`);
  });
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.spacing,
    }
  }
}

// ===== SASS ==================================================================
function _createMixin(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
) {
  if (
    scssVarsLookup &&
    scssVarsLookup.spacing
  ) {
    const finalName = breakpoint ?
      `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
    const propName = `--${prefix}-${finalName}`;

    // Loop through all the spacing elements and create a mixin for each...
    scssVarsLookup.spacing.map(spacing => {
      const fullName = `${finalName}${spacing.name ? `-${spacing.name}` : ''}`;
      const fullVarName = `${propName}${spacing.name ? `-${spacing.name}` : ''}`;

      const bracketStr = new BracketedString();
      bracketStr.addBracket(`@mixin ${fullName}`);
      bracketStr.addBracket(breakpointStart(breakpoint));
      bracketStr.addBracket(suffix ? `&${suffix}` : undefined);
      props.map((prop) => {
        bracketStr.addEntry(`${prop}: var( ${fullVarName} );`);
      });
      result.push(bracketStr.render());
    });
  }
}

