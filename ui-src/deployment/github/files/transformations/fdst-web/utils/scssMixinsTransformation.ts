import {
  cleanAndSortTokens,
  DSysBreakpointGroup,
  DSysBreakpointToken,
  DSysBreakpointTokenset,
  DSysSheetGroupNames,
  FileCreateResults,
  findTokenGroup,
  findTokensSheet,
} from "../../../../../../../shared";
import { createAlignments } from "./cssAtomsSections/sections/alignment";
import { createColors } from "./cssAtomsSections/sections/colors";
import { createEffects } from "./cssAtomsSections/sections/effects";
import { createFont } from "./cssAtomsSections/sections/font";
import { createLayouts } from "./cssAtomsSections/sections/layouts";
import { createSizeMetrics } from "./cssAtomsSections/sections/sizeMetrics";

export default async function scssMixinsTransformation (
  fileCreationResults: FileCreateResults,
  group: DSysSheetGroupNames
) {
  if (!fileCreationResults.tokenResults) return {
    content: '',
    errors: ['no token results'],
  };
  
  const dsys = fileCreationResults.tokenResults.tokens;
  if (!dsys) return {
    content: '',
    errors: ['no tokens'],
  };

  const tokenSheet = findTokensSheet(dsys);
  if (!tokenSheet) return {
    content: '',
    errors: ['no tokensheet'],
  };

  const prefix = tokenSheet.$extensions["dsys.prefix"].toLowerCase();

  const breakpoints = findTokenGroup(
    dsys,
    DSysSheetGroupNames.breakpoint,
  ) as DSysBreakpointGroup;
  
  const output: string[] = [];
  const scssVarsLookup = fileCreationResults.scssVarsLookup;
  
  switch (group) {
    case DSysSheetGroupNames.component :
      output.push( createAlignments(prefix, undefined, undefined, true));
      output.push( createLayouts(prefix, undefined, undefined, true));
      break;
    case DSysSheetGroupNames.color :
      output.push( createColors(prefix, undefined, undefined, scssVarsLookup, true));
      break;
    case DSysSheetGroupNames.type :
      output.push( createFont(prefix, undefined, undefined, scssVarsLookup, true));
      break;
    case DSysSheetGroupNames.spacing :
      output.push( createSizeMetrics(prefix, undefined, undefined, scssVarsLookup, true));
      break;
    case DSysSheetGroupNames.effect :
      output.push( createEffects(prefix, undefined, undefined, scssVarsLookup, true));
      break;
  }

  Object.entries(breakpoints).map(entry => {
    const name = entry[0];
    if (name.indexOf('$') !== 0) {
      const breakpointTokenSet = entry[1] as DSysBreakpointTokenset;
      const breakpointsSorted = cleanAndSortTokens(breakpointTokenSet);
      breakpointsSorted.map(entry => {
        const breakpointToken = entry[1] as DSysBreakpointToken;
        switch (group) {
          case DSysSheetGroupNames.component :
            output.push( createAlignments(prefix, breakpointToken, undefined, true));
            output.push( createLayouts(prefix, breakpointToken, undefined, true));
            break;
          case DSysSheetGroupNames.color :
            output.push( createColors(prefix, breakpointToken, undefined, scssVarsLookup, true));
            break;
          case DSysSheetGroupNames.type :
            output.push( createFont(prefix, breakpointToken, undefined, scssVarsLookup, true));
            break;
          case DSysSheetGroupNames.spacing :
            output.push( createSizeMetrics(prefix, breakpointToken, undefined, scssVarsLookup, true));
            break;
          case DSysSheetGroupNames.effect :
            output.push( createEffects(prefix, breakpointToken, undefined, scssVarsLookup, true));
            break;
        }
      });
    }
  });

  return {
    content: output.join('\n'),
    errors: [],
  }
}