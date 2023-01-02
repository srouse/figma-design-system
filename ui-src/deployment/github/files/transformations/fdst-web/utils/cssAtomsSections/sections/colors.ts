import {
  CssAtomsLookup,
  DSysBreakpointToken,
  DSysSheetGroupNames,
} from "../../../../../../../../../shared";
import {
  breakpointEnd,
  breakpointStart,
} from "./utils";

export function createColors(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();
  _createStyle(prefix, 'background-color',        [`--background-color: ${replaceVar};`, `background-color: var( --background-color );`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'background-color-hover',  [`background-color: ${replaceVar};`], result, ':hover', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'color',                   [`--color: ${replaceVar};`, `color: var( --color );`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'color-hover',             [`color: ${replaceVar};`], result, ':hover', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'border-color',            [`border-color: ${replaceVar};`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'border-top',              [`border-top: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'border-bottom',           [`border-bottom: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'border-left',             [`border-left: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup);
  _createStyle(prefix, 'border-right',            [`border-right: 1px solid ${replaceVar};`], result, '', breakpoint, cssAtomsLookup);
  return result.join('\n');
}

const replaceVar = '{VARIABLE}';

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
  const propName = `--${prefix}-${finalName}`;

  result.push(`
${breakpointStart(breakpoint)}[style*="${propName}: var("]${suffix} {
  ${props.map((prop) => {
    return prop.replace(replaceVar, `var( --${prefix}-color-01, var( ${propName} ))`);
  }).join('\n  ')}
}${breakpointEnd(breakpoint)}`);

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: DSysSheetGroupNames.color,
    }
  }
}
