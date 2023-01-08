import { DSysSheet } from "../../../../../../shared";
import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";

class TSStyleFile extends File {

  path: string = 'transformations/fdst-web/style.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {

    if (
      !this.fileCreationResults ||
      !this.fileCreationResults.tokenResults
    ) return '';
  
    let prefix = '';
    Object.entries(this.fileCreationResults.tokenResults.tokens).map(entry => {
      const name = entry[0];
      if (name.indexOf('$') != 0) {
        const tokenSheet = entry[1] as DSysSheet;
        prefix = tokenSheet.$extensions["dsys.prefix"];
      }
    });

    const prefixLower = prefix.toLowerCase();
    const prefixUpper = prefix.toUpperCase();

    return `/* eslint-disable */
import { ${prefix.toUpperCase()}Prop } from "./css-atoms.d.ts";
import type * as CSS from 'csstype';

/**
 * style
 * Function for dynamically creating and auto-completing
 * ${prefix} design system atoms.
 * @param {DSysProp} dsysStyles
 * @param {CSS.Properties} otherStyles
 * @return {string}
 */
export default function style(
  dsysStyles: ${prefixUpper}Prop,
  otherStyles: CSS.Properties = {},
) : string {
  return \`style="$\{
    Object.entries(dsysStyles).map((entry) => {
      if (entry[1] === true) {
        return \`--${prefixLower}-$\{entry[0]}: 1;\`;
      }else{
        return \`--${prefixLower}-$\{entry[0]}: var( --${prefixLower}-$\{entry[1]} );\`;
      }
    }).join('\\n  ')}$\{
    Object.entries(otherStyles).map((entry) => {
      return \`$\{entry[0]}: $\{entry[1]};\`;
    }).join('\\n  ')
  }"\`;
}
`
  }
}

export default new TSStyleFile();