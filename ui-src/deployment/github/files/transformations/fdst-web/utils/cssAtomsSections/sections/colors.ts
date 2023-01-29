import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames,
  ScssVarsLookup,
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import {
  breakpointStart,
} from "./breakpoints";

export function createColors(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  const _createFunk = isScss ? _createMixin : _createAtom;
  _createFunk(prefix, 'background-color',        [`--background-color: ${replaceVar};`, `background-color: var( --background-color );`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'background-color-hover',  [`background-color: ${replaceVar};`], result, ':hover', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'color',                   [`--color: ${replaceVar};`, `color: var( --color );`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'color-hover',             [`color: ${replaceVar};`], result, ':hover', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border-color',            [`border-color: ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border',                  [`border: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border-top',              [`border-top: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border-bottom',           [`border-bottom: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border-left',             [`border-left: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'border-right',            [`border-right: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup, scssVarsLookup);
  return result.join('\n');
}

const replaceVar = '{VARIABLE}';

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
    bracketStr.addEntry(prop.replace(replaceVar, `var( ${propName} )`));
  });
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.color,
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
    scssVarsLookup.color
  ) {
    const finalName = breakpoint ?
      `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
    const propName = `--${prefix}-color`;

    // Loop through all the colors and create a mixin for each...
    scssVarsLookup.color.map(color => {
      const fullName = `${finalName}${color.name ? `-${color.name}` : ''}`;
      const fullVarName = `${propName}${color.name ? `-${color.name}` : ''}`;

      const bracketStr = new BracketedString();
      bracketStr.addBracket(`@mixin ${fullName}`);
      bracketStr.addBracket(breakpointStart(breakpoint));
      bracketStr.addBracket(suffix ? `&${suffix}` : undefined);
      props.map((prop) => {
        bracketStr.addEntry(prop.replace(replaceVar, `var( ${fullVarName} )`));
      });
      result.push(bracketStr.render());
    });
  }
}
