import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames,
  ScssVarsLookup,
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import { breakpointStart } from "./breakpoints";

export function createFont(
  prefixRaw: string,
  // tokens: TokenSheet, // in case we get further info
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssVarsLookup? : ScssVarsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  
  if (isScss) {
    _createMixin(prefix, result, breakpoint, scssVarsLookup);
  }else{
    _createAtom(prefix, result, breakpoint, cssAtomsLookup);
  }

  /*
  // IF Figma gave enough info...
  const typographyGroup = findGroupViaType( tokens, GroupIds.TYPOGRAPHY );
  typographyGroup?.patterns.map(pattern => {
    pattern.valuesets.map(value => {
      if ( value.values.opentypeFlags !== undefined ) {
        _createFeatureStyle(prefix, value.fullExportName, result, breakpoint);
      }
    });
  });
  */
  return result.join('\n');
}

// ===== CSS ===================================================================
function _createAtom(
  prefix: string,
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `font-${breakpoint.$extensions["dsys.name"]}` : 'font';

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(`[style~="--${prefix}-${finalName}:"]`);
  bracketStr.addEntry(`font: var( --${prefix}-${finalName} );`);
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.type,
    }
  }
}

// ===== SASS ==================================================================
function _createMixin(
  prefix: string,
  result: string[],
  breakpoint? : DSysBreakpointToken,
  scssVarsLookup? : ScssVarsLookup,
) {
  if (
    scssVarsLookup &&
    scssVarsLookup.type
  ) {
    const finalName = breakpoint ?
      `font-${breakpoint.$extensions["dsys.name"]}` : 'font';
    const propName = `--${prefix}-type`;

    // Loop through all the colors and create a mixin for each...
    scssVarsLookup.type.map(type => {
      const fullName = `${finalName}${type.name ? `-${type.name}` : ''}`;
      const fullVarName = `${propName}${type.name ? `-${type.name}` : ''}`;

      const bracketStr = new BracketedString();
      bracketStr.addBracket(`@mixin ${fullName}`);
      bracketStr.addBracket(breakpointStart(breakpoint));
      bracketStr.addEntry(`font: var( ${fullVarName} );`);
      result.push(bracketStr.render());
    });
  }
}

/*
// can't do this in Figma widget anyway, info isn't there.
function _createFeatureStyle(
  prefix: string,
  varSelector: string,
  result: string[],
  breakpoint? : any,
) {
  const finalName = breakpoint ?
    `font-${breakpoint.exportName}` : 'font';

  result.push(`
${breakpointStart(breakpoint)}[style*="--${prefix}-${finalName}: var( --${prefix}-${varSelector}-font "] {
  font-feature-settings: var( --${prefix}-${varSelector}-opentype-flags );
}${breakpointEnd(breakpoint)}`);
}
*/