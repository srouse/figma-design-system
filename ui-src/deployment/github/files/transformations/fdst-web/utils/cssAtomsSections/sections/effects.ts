import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames
} from "../../../../../../../../../shared";
import { breakpointEnd, breakpointStart } from "./utils";

export function createEffects(
  prefixRaw: string,
  // tokens: TokenSheet, // in case we get further info
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  
  _createStyle(prefix, 'shadow',  [`box-shadow: ${replaceVar}`],result, breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'blur',    [`filter: blur(${replaceVar})`],result, breakpoint, cssAtomsLookup);

  return result.join('\n');
}

const replaceVar = '{VARIABLE}';

function _createStyle(
  prefix: string,
  name: string,
  props: string[],
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
  const propName = `--${prefix}-${finalName}`;

  result.push(`
${breakpointStart(breakpoint)}[style*="--${prefix}-${finalName}: var("] {
  ${props.map((prop) => {
    return prop.replace(replaceVar, `var( ${propName} )`);
  }).join('\n  ')}
}${breakpointEnd(breakpoint)}`);

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.effect,
    }
  }
}
