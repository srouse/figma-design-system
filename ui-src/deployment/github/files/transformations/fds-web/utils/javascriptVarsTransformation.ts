import {
  FileCreateResults,
} from "../../../../../../../shared";
import variablesTransformation from "./variablesTransformation";

export default async function javascriptVarsTransformation (
  fileCreationResults: FileCreateResults,
) {
  const transformationResults = await variablesTransformation(
    fileCreationResults
  );

  console.log('transformationResults', transformationResults);
  const content: {[key: string]: string} = {};
  if (transformationResults?.lookup) {
    Object.entries(transformationResults.lookup).map((
      [key, value]
    ): void => {
      const keyTrimmed = key.substring(2);
      content[snakeToCamel(keyTrimmed)] =
        (value as any).value;
    })
  }

  return {
    content: `export default ${JSON.stringify(content, null, 2)};`,
    errors: [],
  }
}

function snakeToCamel(str: string): string {
  // trim off leading slashes...

  return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
