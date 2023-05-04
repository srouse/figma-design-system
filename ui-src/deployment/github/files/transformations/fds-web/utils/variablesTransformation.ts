import {
  DSysSheet,
  DSysToken,
  DTTokenType,
  toKebobCase,
  DSysSheetGroupNames,
  roundToDecimal,
  FileCreateResults,
  loopDesignSystemTokens,
  CssVarsLookup,
  ScssVarsLookup,
} from "../../../../../../../shared";

export default async function variablesTransformation (
  fileCreationResults: FileCreateResults,
  isScss: boolean = false,
) {
  if (!fileCreationResults || !fileCreationResults.tokenResults) return;
  const tokens = fileCreationResults.tokenResults.tokens;

  let lookup = {};
  if (isScss) {
    fileCreationResults.scssVarsLookup = {};
    lookup = fileCreationResults.scssVarsLookup;
  }else{
    fileCreationResults.cssVarsLookup = {};
    lookup = fileCreationResults.cssVarsLookup;
  }
  
  const output: string[] = [];
  if (!isScss) output.push(':root {');

  let prefix: string = '';

  const outputFunk = isScss ? addToScssOutput : addToCssOutput;

  loopDesignSystemTokens(
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
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.color,
          toKebobCase(token.$extensions["dsys.name"]),
          `${
            hexToRGBA(
              token.$value.hex,
              token.$value.alpha,
            )}`
        );
      }
      // CUSTOM
      if (token.$type === DTTokenType.custom) {
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.custom,
          toKebobCase(token.$extensions["dsys.name"]),
          `${token.$value}`
        );
      }

      // SPACING
      if (token.$type === DTTokenType.spacing) {
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.spacing,
          toKebobCase(token.$extensions["dsys.name"]),
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
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.type,
          toKebobCase(token.$extensions["dsys.name"]),
          `${
            token.$value.fontWeight} ${
            roundToDecimal(finalSize, 3)}em/${
            roundToDecimal(finalLineHeight, 3)}em '${
            token.$value.fontFamily
          }'`
        );
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.type,
          `${toKebobCase(token.$extensions["dsys.name"])}-size`,
          token.$value.fontSize
        );
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.type,
          `${toKebobCase(token.$extensions["dsys.name"])}-weight`,
          token.$value.fontWeight
        );
      }

      // EFFECTS
      if (token.$type === DTTokenType.blur) {
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.effect,
          `${toKebobCase(token.$extensions["dsys.name"])}-blur-radius`,
          `${token.$value.radius}px`
        );
      }
      if (token.$type === DTTokenType.shadow) {
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.effect,
          `${toKebobCase(token.$extensions["dsys.name"])}-shadow`,
          `${
            token.$value.offsetX}px ${
            token.$value.offsetY}px ${
            token.$value.radius}px ${
            token.$value.spread}px ${hexToRGBA(
              token.$value.color, token.$value.alpha
            )}`
        );
      }
      // BREAKPOINTS
      if (token.$type === DTTokenType.breakpoint) {
        outputFunk(
          prefix, output, lookup,
          DSysSheetGroupNames.breakpoint,
          `${toKebobCase(token.$extensions["dsys.name"])}-${token.$direction}`,
          `${token.$value}px`
        );
      }

      // ICONS
      // NOT HERE

      // COMPONENTS
      // NOT HERE
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
    outputFunk(
      prefix, output, lookup,
      DSysSheetGroupNames.spacing,
      `col-${name}`,
      `${roundToDecimal((multiplier * (100/12)), 4)}%`
    );
  });
  colSteps.map(step => {
    const name = step[0];
    const multiplier = step[1];
    outputFunk(
      prefix, output, lookup,
      DSysSheetGroupNames.spacing,
      `colvw-${name}`,
      `${roundToDecimal((multiplier * (100/12)), 4)}vw`
    );
  });

  if (!isScss) output.push('}');

  return {
    content: output.join('\n'),
    output,
    lookup,
    errors: [],
  }
}

function addToCssOutput(
  prefix: string,
  output: string[],
  cssVarsLookup: CssVarsLookup,
  category: DSysSheetGroupNames,
  name: string,
  value: string | number,
) {
  const finalCategory = name.indexOf(category) === 0 ? '' : `${category}-`;
  const varName = `--${prefix}-${finalCategory}${name}`;
  output.push(`  ${varName}: ${value};`);
  cssVarsLookup[varName] = {
    category,
    value
  };
}

function addToScssOutput(
  prefix: string,
  output: string[],
  scssVarsLookup: ScssVarsLookup,
  category: DSysSheetGroupNames,
  name: string,
  value: string | number,
) {
  const finalCategory = name.indexOf(category) === 0 ? '' : `${category}-`;
  const varName = `$${prefix}-${finalCategory}${name}`;
  output.push(`${varName}: ${value};`);
  if (!scssVarsLookup[category]) {
    scssVarsLookup[category] = [];
  }
  scssVarsLookup[category]?.push({
    name,
    value
  });
}

function hexToRGBA(hex: string, alpha?: number) {
  if (alpha !== undefined && alpha !== 1) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${roundToDecimal(alpha, 3)})`;
  } else {
      return hex;
  }
}

