import {
  CssAtomsLookup,
  DSysBreakpointToken,
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import { breakpointEnd, breakpointStart } from "./breakpoints";

export function createLayouts(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();

  const createFunk = isScss ? _createMixin : _createAtom;
  const createSimpleFunk = isScss ? _createSimpleAtom : _createSimpleMixin;

  createFunk(prefix, 'element', `${element}\n  display: block;`, result, '', breakpoint, cssAtomsLookup);
  createFunk(prefix, 'layout', `${element}\n  display: block;`, result, '', breakpoint, cssAtomsLookup);
  createFunk(prefix, 'text', `${element}\n  display: inline-block;`, result, '', breakpoint, cssAtomsLookup);

  createFunk(prefix, 'stack', `${element}\n  display: block;`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child']);
  createFunk(prefix, 'stack', stackNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'stack', stackLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');

  createFunk(prefix, 'layout', `${element}\n  display: block;`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child']);
  createFunk(prefix, 'layout', stackNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'layout', stackLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');

  createFunk(prefix, 'flex-h', `${element}${flexElement}${flexH}`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child']);
  createFunk(prefix, 'flex-h', flexHNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'flex-h', flexHLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');

  createFunk(prefix, 'flex-v', `${element}${flexElement}${flexV}`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child']);
  createFunk(prefix, 'flex-v', flexVNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'flex-v', flexVLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');

  createFunk(prefix, 'center', `${element}${flexElement}${center}`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child']);
  createFunk(prefix, 'center', centerNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'center', centerLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');

  createFunk(prefix, 'float', `${element}${float}`, result, '', breakpoint, cssAtomsLookup, '', ['-children', '-last-child', '-after']);
  createFunk(prefix, 'float', floatNthChild, result, ' > *:nth-child(n)', breakpoint, cssAtomsLookup, '-children');
  createFunk(prefix, 'float', floatLastChild, result, ' > *:last-child', breakpoint, cssAtomsLookup, '-last-child');
  createFunk(prefix, 'float', floatAfter, result, '::after', breakpoint, cssAtomsLookup, '-after');

  createSimpleFunk(prefix, 'float-left', `\n  float: left;\n`, result, '', breakpoint, cssAtomsLookup);
  createSimpleFunk(prefix, 'float-right', `\n  float: right;\n`, result, '', breakpoint, cssAtomsLookup);
  createSimpleFunk(prefix, 'float-clear-left', `\n  clear: left;\n  float: left;\n`, result, '', breakpoint, cssAtomsLookup);
  createSimpleFunk(prefix, 'float-clear-right', `\n  clear: right;\n  float: right;\n`, result, '', breakpoint, cssAtomsLookup);

  createSimpleFunk(prefix, 'fill-children', `\n  flex: 1;\n`, result, ' > *', breakpoint, cssAtomsLookup);
  createSimpleFunk(prefix, 'children-fill', `\n  flex: 1;\n`, result, ' > *', breakpoint, cssAtomsLookup);

  createSimpleFunk(prefix, 'hide', `\n  display: none;\n`, result, '', breakpoint, cssAtomsLookup);
  return result.join('\n');
}

// ======== STACK / LAYOUT =====================================================
const stackNthChild = `
  --gap-h-int: 0px;
  --gap-v-int: var( --gap, var( --gap-v, initial ));
  width: 100%;
`;

const stackLastChild = `
  --gap-v-int: 0px;
`;

// ======== FLEX-H =============================================================
const flexH = `
  display: flex;
  flex-flow: row nowrap;
  --ai-h: flex-start;
  --jc-h: flex-start;
  --ai-int: var( --ai-h, initial );
  --jc-int: var( --jc-h, initial );
`;

const flexHNthChild = `
  --gap-h-int: var( --gap , var( --gap-h, initial ));
  --gap-v-int: 0px;
`;

const flexHLastChild = `
  --gap-h-int: 0px;
`;

// ======== FLEX-V =============================================================
const flexV = `
  display: flex;
  flex-flow: column nowrap;
  --ai-v: flex-start;
  --jc-v: flex-start;
  --ai-int: var( --ai-v, initial );
  --jc-int: var( --jc-v, initial );
`;

const flexVNthChild = `
  --gap-h-int: 0px;
  --gap-v-int: var( --gap, var( --gap-v, initial ));
`;

const flexVLastChild = `
  --gap-v-int: 0px;
`;

// ======== CENTER =============================================================
const center = `
  display: flex;
  flex-flow: column nowrap;
  --ai-v: center;
  --jc-v: center;
  --ai-int: var( --ai-v, initial );
  --jc-int: var( --jc-v, initial );
`;

const centerNthChild = `
  --gap-h-int: 0px;
  --gap-v-int: var( --gap, var( --gap-v, initial ));
`;

const centerLastChild = `
  --gap-v-int: 0px;
`;

// ======== FLOAT ==============================================================
const float = `
  display: block;
`;

const floatNthChild = `
  --gap-h-int: 0px;
  --gap-v-int: var( --gap, var( --gap-v, initial ));
  width: auto;
  float: left;
  clear: left;
`;

const floatLastChild = `
  --gap-v-int: 0px;
`;

const floatAfter = `
  content: "";
  clear: both;
  display: table;
`;

// ======== ELEMENT ============================================================
const element = `
  /* element */
  position: relative;
  box-sizing: border-box;
  --margin-right: initial;
  --margin-bottom: initial;
  --gap-h-int: initial;
  --gap-v-int: initial;
  margin-right: var( --margin-right, var( --gap-h-int, initial ) );
  margin-bottom: var( --margin-bottom, var( --gap-v-int, initial ) );
`;

// ======== FLEX ELEMENT =======================================================
const flexElement = `
  /* flex element */
  position: relative;
  box-sizing: border-box;
  --align-items: initial;
  --justify-content: initial;
  align-items: var( --align-items , var( --ai-int, flex-start ) );
  justify-content: var( --justify-content , var( --jc-int, flex-start ) );
`;


// ===== CSS ===================================================================
function _createAtom(
  prefix: string,
  name: string,
  content: string,
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssSuffix: string = '',
  scssIncludes: string[] = [],
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
  const nodeSelector = breakpoint ? `` : `${prefix}-${finalName}${suffix},\n`;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(
    `${nodeSelector}[style~="--${prefix}-${finalName}:"]${suffix}`
  );
  bracketStr.addEntry(content);
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: true,
    }
  }
}

function _createSimpleAtom(
  prefix: string,
  name: string,
  content: string,
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(
    `[style~="--${prefix}-${finalName}:"]${suffix}`
  );
  bracketStr.addEntry(content);
  result.push(bracketStr.render());

  if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
    cssAtomsLookup[finalName] = {
      category: true,
    }
  }
}

// ===== SASS ==================================================================
function _createMixin(
  prefix: string,
  name: string,
  content: string,
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  scssSuffix: string = '',
  scssIncludeSuffixes: string[] = [],
) {
  if (scssSuffix && breakpoint) return;

  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(`@mixin ${prefix}-${finalName}${scssSuffix}`);
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(suffix ? `&${suffix}` : undefined);
  bracketStr.addEntry(content);
  scssIncludeSuffixes?.map(includeSuffix => {
    bracketStr.addEntry(`@include ${prefix}-${name}${scssSuffix}${includeSuffix};`);
  });
  result.push(bracketStr.render());
}

function _createSimpleMixin(
  prefix: string,
  name: string,
  content: string,
  result: string[],
  suffix: string = '',
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const finalName = breakpoint ?
    `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

  const bracketStr = new BracketedString();
  bracketStr.addBracket(`@mixin ${prefix}-${finalName}`);
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(suffix ? `&${suffix}` : undefined);
  bracketStr.addEntry(content);
  result.push(bracketStr.render());
}