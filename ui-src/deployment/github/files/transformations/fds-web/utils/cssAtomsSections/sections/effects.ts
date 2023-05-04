import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames,
  ScssVarsLookup,
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import { breakpointEnd, breakpointStart } from "./breakpoints";

export function createEffects(
  prefixRaw: string,
  // tokens: TokenSheet, // in case we get further info
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  const _createFunk = isScss ? _createMixin : _createAtom;
  
  _createFunk(prefix, 'shadow',  [`box-shadow: ${replaceVar}`],result, breakpoint, cssAtomsLookup, scssVarsLookup);
  _createFunk(prefix, 'blur',    [`filter: blur(${replaceVar})`],result, breakpoint, cssAtomsLookup, scssVarsLookup);

  return result.join('\n');
}

const replaceVar = '{VARIABLE}';

// ===== CSS ===================================================================
function _createAtom(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
  const propName = `--${prefix}-${finalName}`;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(`[style~="${propName}:"]`);
  props.map((prop) => {
    bracketStr.addEntry(prop.replace(replaceVar, `var( ${propName} )`));
  });
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.effect,
    }
  }
}

// ===== SASS ==================================================================
function _createMixin(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
) {
  if (
    scssVarsLookup &&
    scssVarsLookup.effect
  ) {
    const finalName = breakpoint ?
      `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
    const propName = `--${prefix}-effect`;

    // Loop through all the effects and create a mixin for each...
    scssVarsLookup.effect.map(effect => {
      const fullName = `${finalName}${effect.name ? `-${effect.name}` : ''}`;
      const fullVarName = `${propName}${effect.name ? `-${effect.name}` : ''}`;

      const bracketStr = new BracketedString();
      bracketStr.addBracket(`@mixin ${fullName}`);
      bracketStr.addBracket(breakpointStart(breakpoint));
      props.map((prop) => {
        bracketStr.addEntry(prop.replace(replaceVar, `var( ${fullVarName} )`));
      });
      result.push(bracketStr.render());
    });
  }
}

