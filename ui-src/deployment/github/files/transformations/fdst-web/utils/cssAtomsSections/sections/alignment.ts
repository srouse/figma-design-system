import { 
  CssAtomsLookup,
  DSysBreakpointToken
} from "../../../../../../../../../shared";
import BracketedString from "./bracketedString";
import { breakpointStart } from "./breakpoints";

export function createAlignments(
  prefixRaw: string,
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
  isScss: boolean = false,
) {
  const result: string[] = [];
  const prefix = prefixRaw.toLowerCase();

  const createFunk = isScss ? _createMixin : _createAtom;

  createFunk(prefix,
    ['alignment-center', 'alignment-center-center'],
    ['center','center','center','center'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-center-left', 'alignment-left-center'],
    ['center','flex-start','flex-start','center'],
    result, breakpoint, cssAtomsLookup
  );
  createFunk(prefix,
    ['alignment-center-right', 'alignment-right-center'],
    ['center','flex-end','flex-end','center'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-top', 'alignment-top-left', 'alignment-left-top', 'alignment-left'],
    ['flex-start','flex-start','flex-start','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-top-center', 'alignment-center-top'],
    ['flex-start','center','center','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-top-right', 'alignment-right-top', 'alignment-right'],
    ['flex-start','flex-end','flex-end','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-bottom-left', 'alignment-left-bottom', 'alignment-bottom'],
    ['flex-end','flex-start','flex-start','flex-end'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-bottom-center', 'alignment-center-bottom'],
    ['flex-end','center','center','flex-end'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-bottom-right', 'alignment-right-bottom'],
    ['flex-end','flex-end','flex-end','flex-end'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-stretch', 'alignment-stretch-left', 'alignment-left-stretch', 'alignment-stretch-top', 'alignment-top-stretch'],
    ['stretch','flex-start','stretch','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-stretch-right', 'alignment-right-stretch', 'alignment-stretch-bottom', 'alignment-bottom-stretch'],
    ['stretch','flex-end','stretch','flex-end'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-stretch-center', 'alignment-center-stretch'],
    ['stretch','center','stretch','center'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['baseline', 'alignment-baseline-left', 'alignment-left-baseline'],
    ['baseline','flex-start','flex-start','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-baseline-right', 'alignment-right-baseline'],
    ['baseline','flex-start','flex-start','flex-start'],
    result, breakpoint, cssAtomsLookup
  );

  createFunk(prefix,
    ['alignment-baseline-center', 'alignment-center-baseline'],
    ['baseline','center','center','flex-start'],
    result, breakpoint, cssAtomsLookup
  );
  return result.join('\n');
}

// ===== CSS ===================================================================
function _createAtom(
  prefix: string,
  names: string[],
  values: string[],
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  const selectors: string[] = [];
  names.map(name => {
    const finalName = breakpoint ?
      `${name}-${breakpoint.$extensions["dsys.name"]}` : name;
    selectors.push(`
[style~="--${prefix}-${finalName}:"]`);

    if (cssAtomsLookup && !cssAtomsLookup[finalName]) {
      cssAtomsLookup[finalName] = {
        category: true,
      }
    }
  });

  const bracketStr = new BracketedString();
  bracketStr.addBracket(breakpointStart(breakpoint));
  bracketStr.addBracket(selectors);
  bracketStr.addEntry(`
    --ai-h: ${values[0]};
    --jc-h: ${values[1]};
    --ai-v: ${values[2]};
    --jc-v: ${values[3]};
  `);
  result.push(bracketStr.render());
}

// ===== SASS ==================================================================
function _createMixin(
  prefix: string,
  names: string[],
  values: string[],
  result: string[],
  breakpoint? : DSysBreakpointToken,
  cssAtomsLookup? : CssAtomsLookup,
) {
  names.map(name => {
    const finalName = breakpoint ?
      `${name}-${breakpoint.$extensions["dsys.name"]}` : name;

    const bracketStr = new BracketedString();
    bracketStr.addBracket(`@mixin ${finalName}`);
    bracketStr.addBracket(breakpointStart(breakpoint));
    bracketStr.addEntry(`
      --ai-h: ${values[0]};
      --jc-h: ${values[1]};
      --ai-v: ${values[2]};
      --jc-v: ${values[3]};
    `);
    result.push(bracketStr.render());
  });
}

