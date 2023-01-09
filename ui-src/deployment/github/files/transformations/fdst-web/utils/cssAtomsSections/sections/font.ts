// import { GroupIds, TokenPattern, TokenSheet } from "../../../types";
// import { findGroupViaType } from "../../../utils/tokenSheetAccessors";
import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames
} from "../../../../../../../../../shared";
import { breakpointEnd, breakpointStart } from "./breakpoints";

export function createFont(
  prefixRaw: string,
  // tokens: TokenSheet, // in case we get further info
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  
  _createStyle(prefix, result, breakpoint, cssAtomsLookup);

  /*
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

function _createStyle(
  prefix: string,
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `font-${breakpoint.$extensions["dsys.name"]}` : 'font';

  result.push(`
${breakpointStart(breakpoint)}[style*="--${prefix}-${finalName}: var("] {
  font: var( --${prefix}-${finalName} );
}${breakpointEnd(breakpoint)}`);

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.type,
    }
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