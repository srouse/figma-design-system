import {
  DSys,
  DSysSheet,
  DSysGroup,
  DSysTokenset,
  DSysToken,
  DTTokenType,
  toKebobCase,
} from "../../../../../shared";

export default async function cssVariablesTransformation (
  tokens: DSys
) {
  const cssVars: string[] = [':root {'];
  let prefix: string = '';
  loopDsys(
    tokens,
    (tokensSheet: DSysSheet) => {
      // will always be called first
      prefix = tokensSheet.$extensions["dsys.prefix"];
    },
    undefined,
    undefined,
    (token: DSysToken) => {
      // COLOR
      if (token.$type == DTTokenType.color) {
        cssVars.push(`${varName(prefix, token)}: ${
          hexToRGBA(
            token.$value.hex,
            token.$value.alpha,
          )
        };`);
      }
      // CUSTOM
      if (token.$type == DTTokenType.custom) {
        cssVars.push(`${varName(prefix, token)}: ${token.$value};`);
      }
      // SPACING
      if (token.$type == DTTokenType.spacing) {
        cssVars.push(`${varName(prefix, token)}: ${token.$value}px;`);
      }
      // TYPOGRAPHY
      if (token.$type == DTTokenType.typography) {
        let lineHeight = token.$value.fontSize * 1.2;
        if (token.$value.lineHeight.unit === 'PIXELS') {
          lineHeight = token.$value.lineHeight.value;
        }else if (token.$value.lineHeight.unit === 'PERCENT') {
          lineHeight = token.$value.fontSize * 
           ( token.$value.lineHeight.value * 0.01 );
        }
        const finalSize = token.$value.fontSize / 16;
        const finalLineHeight = lineHeight / 16;
        cssVars.push(`${varName(prefix, token)}: ${
          token.$value.fontWeight} ${
          finalSize.toFixed(3)}em/${
          finalLineHeight.toFixed(3)}em '${
          token.$value.fontFamily}';`);
      }
      // console.log('token', token);
    }
    
  )
  // TODO: add col and colvw...

  cssVars.push('}')
  // console.log('cssVars', cssVars);

  return {
    content: cssVars.join('\n'),
    errors: [],
  }
}

function varName(prefix: string, token: DSysToken) {
  return `  --${
    prefix
  }-${
    toKebobCase(
      token.$extensions["dsys.name"]
    )
  }`;
}

function hexToRGBA(hex: string, alpha?: number) {
  if (alpha !== undefined && alpha !== 1) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
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
