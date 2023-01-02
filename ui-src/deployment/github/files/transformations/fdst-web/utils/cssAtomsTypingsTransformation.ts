import {
  DSysSheet,
  FileCreateResults,
  snakeToCamelCase,
} from "../../../../../../../shared";

export default async function cssAtomsTypingsTransformation (
  fileCreationResults: FileCreateResults,
) {
  if (
    !fileCreationResults ||
    !fileCreationResults.cssAtomsLookup ||
    !fileCreationResults.tokenResults
  ) return;
  const cssTypings: string[] = [];

  let prefix = '';
  Object.entries(fileCreationResults.tokenResults.tokens).map(entry => {
    const name = entry[0];
    if (name.indexOf('$') != 0) {
      const tokenSheet = entry[1] as DSysSheet;
      prefix = tokenSheet.$extensions["dsys.prefix"];
    }
  });

  const prefixUpper = prefix.toUpperCase();

  cssTypings.push(`import {
  ${prefixUpper}ColorValue,
  ${prefixUpper}TypeValue,
  ${prefixUpper}EffectValue,
  ${prefixUpper}SpacingValue,
} from './css-vars.d.ts';
`);
  cssTypings.push(`export type ${prefixUpper}Prop = {`);
  Object.entries(fileCreationResults.cssAtomsLookup).map(entry => {
    const name = entry[0] as string;
    const info = entry[1] as {category: string | true};
    cssTypings.push(`  ${snakeToCamelCase(name)}?: ${
      info.category === true ?
        'true' :
        `${prefixUpper}${capFirstLetter(info.category)}Value`
    },`);
  })
  cssTypings.push('}');

  return {
    content: cssTypings.join('\n'),
    errors: [],
  }
}

function capFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}