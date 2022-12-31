import {
  DSys,
  DSysSheet,
  DSysGroup,
  DSysTokenset,
  DSysToken,
  DTTokenType,
  toKebobCase,
  DSysSheetGroupNames,
  roundToDecimal,
} from "../../../../../shared";

export default async function cssVariablesTransformation (
  tokens: DSys
) {
  const cssVars: string[] = [':root {'];
  const cssVarsLookup: {[key:string]: string} = {};
  let prefix: string = '';
  loopDsys(
    tokens,
    (tokensSheet: DSysSheet) => {
      // will always be called first
      prefix = tokensSheet.$extensions["dsys.prefix"].toLowerCase();
    },
    undefined,
    undefined,
    (token: DSysToken) => {
      // COLOR
      if (token.$type === DTTokenType.color) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          varName(token, DSysSheetGroupNames.color),
          `${
            hexToRGBA(
              token.$value.hex,
              token.$value.alpha,
            )}`
        );
      }
      // CUSTOM
      if (token.$type === DTTokenType.custom) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          varName(token, DSysSheetGroupNames.custom),
          `${token.$value}`
        );
      }
      // SPACING
      if (token.$type === DTTokenType.spacing) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          varName(token, DSysSheetGroupNames.spacing),
          `${token.$value}px`
        );
      }
      // TYPOGRAPHY
      if (token.$type === DTTokenType.typography) {
        let lineHeight = token.$value.fontSize * 1.2;
        if (token.$value.lineHeight.unit === 'PIXELS') {
          lineHeight = token.$value.lineHeight.value;
        }else if (token.$value.lineHeight.unit === 'PERCENT') {
          lineHeight = token.$value.fontSize * 
           ( token.$value.lineHeight.value * 0.01 );
        }
        const finalSize = token.$value.fontSize / 16;
        const finalLineHeight = lineHeight / 16;
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          varName(token, DSysSheetGroupNames.type),
          `${
            token.$value.fontWeight} ${
            roundToDecimal(finalSize, 3)}em/${
            roundToDecimal(finalLineHeight, 3)}em '${
            token.$value.fontFamily
          }'`
        );
      }
      // EFFECTS
      if (token.$type === DTTokenType.blur) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          `${varName(token, DSysSheetGroupNames.effect)}-blur-radius`,
          `${token.$value.radius}px`
        );
      }
      if (token.$type === DTTokenType.shadow) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          `${varName(token, DSysSheetGroupNames.effect)}-shadow`,
          `${
            token.$value.offsetX}px ${
            token.$value.offsetY}px ${
            token.$value.radius}px ${
            token.$value.spread}px rgba(${hexToRGBA(
              token.$value.color, token.$value.alpha
            )})`
        );
      }
      // BREAKPOINTS
      if (token.$type === DTTokenType.breakpoint) {
        addToOutput(
          prefix, cssVars, cssVarsLookup,
          `${varName(token, DSysSheetGroupNames.breakpoint)}-${token.$direction}`,
          `${token.$value}px`
        );
      }

      // ICONS
      // NOT HERE

      // COMPONENTS
      // NOT HERE...
    }
    
  )
  // Following activated properties pattern...we need cols as vars.
  const colSteps: [string, number][] = [
    ['0', 0],
    ['0-3', 0.3333], ['0-4', 0.25], ['0-6', 0.5], ['0-8', 0.75], ['0-9', 0.6666],
    ['1', 1],
    ['1-3', 1.3333], ['1-4', 1.25], ['1-6', 1.5], ['1-8', 1.75], ['1-9', 1.6666],
    ['2', 2],
    ['2-3', 2.3333], ['2-4', 2.25], ['2-6', 2.5], ['2-8', 2.75], ['2-9', 2.6666],
    ['3', 3],
    ['3-3', 3.3333], ['3-4', 3.25], ['3-6', 3.5], ['3-8', 3.75], ['3-9', 3.6666],
    ['4', 4],
    ['5', 5],
    ['6', 6],
    ['7', 7],
    ['8', 8],
    ['9', 9],
    ['10', 10],
    ['11', 11],
    ['12', 12],
  ];
  colSteps.map(step => {
    const name = step[0];
    const multiplier = step[1];
    addToOutput(
      prefix, cssVars, cssVarsLookup,
      `${DSysSheetGroupNames.spacing}-col-${name}`,
      `${roundToDecimal((multiplier * (100/12)), 4)}%`
    );
  });
  colSteps.map(step => {
    const name = step[0];
    const multiplier = step[1];
    addToOutput(
      prefix, cssVars, cssVarsLookup,
      `${DSysSheetGroupNames.spacing}-colvw-${name}`,
      `${roundToDecimal((multiplier * (100/12)), 4)}vw`
    );
  });

  cssVars.push('}')
  // console.log('cssVars', cssVars);

  return {
    content: cssVars.join('\n'),
    lookup: cssVarsLookup,
    errors: [],
  }
}

function addToOutput(
  prefix: string,
  cssVars: string[],
  cssVarsLookup: {[key:string]: string},
  name: string,
  value: string,
) {
  const varName = `--${prefix}-${name}`;
  cssVars.push(`  ${varName}: ${value};`);
  cssVarsLookup[varName] = value;
}

function varName(token: DSysToken, category?: string) {
  const tokenName = toKebobCase(
    token.$extensions["dsys.name"]
  );
  const tokenNameStartsWithCategory = category ? 
    tokenName.indexOf(category) === 0 : false;
  return `${
    (!tokenNameStartsWithCategory && category) ? `${category}-` : ''
  }${
    tokenName
  }`;
}


function hexToRGBA(hex: string, alpha?: number) {
  if (alpha !== undefined && alpha !== 1) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${roundToDecimal(alpha, 3)}`;
  } else {
      return hex;
  }
}

function loop(obj: {}, callback: (vaue: any) => void ) {
  Object.entries(obj).map(entry => {
    const name = entry[0];
    const value = entry[1];
    if (name.indexOf('$') != 0) {
      callback(value);
    }
  })
}

function loopDsys(
  dSys: DSys,
  tokensSheetCallback?: (tokensSheet: DSysSheet) => void,
  tokenGroupCallback?: (tokenGroup: DSysGroup<any, any>) => void,
  tokenSetCallback?: (tokenset: DSysTokenset) => void,
  tokenCallback?: (token: DSysToken) => void,
) {
  loop(dSys,
    (tokensSheet: any) => {
      if (tokensSheetCallback)
        tokensSheetCallback(tokensSheet);
      loop(tokensSheet,
        (tokenGroup: any) => {
          if (tokenGroupCallback)
            tokenGroupCallback(tokenGroup as DSysGroup<any, any>);
          loop(tokenGroup,
            (tokenSet: any) => {
              if (tokenSetCallback)
                tokenSetCallback(tokenSet as DSysTokenset);
              loop(tokenSet,
                (token: any) => {
                  if (tokenCallback)
                    tokenCallback(token as DSysToken);
                }
              );
            }
          );
        }
      );
    }
  );
}
