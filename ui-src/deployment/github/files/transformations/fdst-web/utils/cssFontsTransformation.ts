import {
  DSysSheet,
  DSysToken,
  DTTokenType,
  FileCreateResults,
  loopDesignSystemTokens,
  typeTokenToGoogleFontsUrl,
} from "../../../../../../../shared";

export default async function cssFontsTransformation (
  fileCreationResults: FileCreateResults,
) {
  if (
    !fileCreationResults ||
    !fileCreationResults.tokenResults
  ) return;

  const fontUrlLookup: {[key:string]: true} = {};
  loopDesignSystemTokens(
    fileCreationResults.tokenResults.tokens,
    undefined,
    undefined,
    undefined,
    (token: DSysToken) => {
      // TYPOGRAPHY
      if (token.$type === DTTokenType.typography) {
        const cssUrl = typeTokenToGoogleFontsUrl(token);
        if (cssUrl)
          fontUrlLookup[cssUrl] = true;
        console.log('cssUrl', cssUrl);
      }
    },
  );

  const output: string[] = [];
  const uniqueFontUrls = Object.keys(fontUrlLookup);
  uniqueFontUrls.map(fontUrl => {
    output.push(`@import "${fontUrl}";`)
  })

  return {
    content: output.join('\n'),
    errors: [],
  }
}
