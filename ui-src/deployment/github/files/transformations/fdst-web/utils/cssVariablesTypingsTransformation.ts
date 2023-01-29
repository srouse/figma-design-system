import {
  DSysSheet,
  FileCreateResults,
} from "../../../../../../../shared";

export default async function cssVariablesTypingsTransformation (
  fileCreationResults: FileCreateResults,
) {
  if (
    !fileCreationResults ||
    !fileCreationResults.cssVarsLookup ||
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

  const categoryTypings: {[key:string]: string[]} = {};
  
  // organize into categories
  Object.entries(fileCreationResults.cssVarsLookup).map(entry => {
    const varName = entry[0] as string;
    const info = entry[1] as {
      category: string,
      value: string
    };
    const varPrefix = `--${prefix.toLowerCase()}-`;
    const output = `  '${varName.replace(varPrefix, '')}'`;
    if (!categoryTypings[info.category]) categoryTypings[info.category] = []
    categoryTypings[info.category].push(output);
  });
  
  // render typings relative to category
  const categoryNames: string[] = [];
  Object.entries(categoryTypings).map(entry => {
    const category = entry[0] as string;
    const categoryOutput = entry[1] as string[];
    const categoryName = `${
      prefix.toUpperCase()}${
      capFirstLetter(category)
    }Value`;
    categoryNames.push(categoryName);
    cssTypings.push(`export type ${categoryName} =`);
    cssTypings.push( `${categoryOutput.join(' |\n')};` );
    cssTypings.push( '' );
  });

  // render an umbrella typing
  cssTypings.push(`export type ${prefix.toUpperCase()}Value =`);
  cssTypings.push( `  ${categoryNames.join(' |\n  ')};` );
  cssTypings.push( '' );

  return {
    content: cssTypings.join('\n'),
    errors: [],
  }
}

function capFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}