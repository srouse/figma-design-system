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

export default async function cssAtomsTransformation (
  fileCreationResults: FileCreateResults,
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
 
  if (!fileCreationResults.cssAtomsLookup) {
    fileCreationResults.cssAtomsLookup = {};
  }

  const tokenSheet = findTokensSheet(dsys);
  if (!tokenSheet) return {
    content: '',
    errors: ['no tokensheet'],
  };

  const prefix = tokenSheet.$extensions["dsys.prefix"].toLowerCase();

  

  const output: string[] = [];
  const cssAtomsLookup = fileCreationResults.cssAtomsLookup;
  output.push( createAlignments(prefix, undefined, cssAtomsLookup));
  output.push( createColors(prefix, undefined, cssAtomsLookup));
  output.push( createFont(prefix, undefined, cssAtomsLookup));
  output.push( createLayouts(prefix, undefined, cssAtomsLookup));
  output.push( createSizeMetrics(prefix, undefined, cssAtomsLookup));
  output.push( createEffects(prefix, undefined, cssAtomsLookup));

  const breakpoints = findTokenGroup(
    dsys,
    DSysSheetGroupNames.breakpoint,
  ) as DSysBreakpointGroup;
  if (breakpoints) {
    Object.entries(breakpoints).map(entry => {
      const name = entry[0];
      if (name.indexOf('$') !== 0) {
        const breakpointTokenSet = entry[1] as DSysBreakpointTokenset;
        const breakpointsSorted = cleanAndSortTokens(breakpointTokenSet);
        breakpointsSorted.map(entry => {
          const breakpointToken = entry[1] as DSysBreakpointToken;
          output.push( createAlignments(prefix, breakpointToken, cssAtomsLookup));
          output.push( createColors(prefix, breakpointToken, cssAtomsLookup));
          output.push( createFont(prefix, breakpointToken, cssAtomsLookup));
          output.push( createLayouts(prefix, breakpointToken, cssAtomsLookup));
          output.push( createSizeMetrics(prefix, breakpointToken, cssAtomsLookup));
          output.push( createEffects(prefix, breakpointToken, cssAtomsLookup));
        });
      }
    });
  }

  return {
    content: output.join('\n'),
    errors: [],
  }
}