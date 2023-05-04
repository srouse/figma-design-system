import { DSysSheet } from "../../../../../../shared";
import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";

class TSStyleFile extends File {

  path: string = 'transformations/fds-web/style.ts';

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
import { ${prefix.toUpperCase()}Prop } from "./css-atoms";
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
  const toKebab =
    (str) => str.replace(/([a-z0–9])([A-Z])/g, "$1-$2").toLowerCase();
  return \`style="$\{
    Object.entries(dsysStyles).map((entry) => {
      const name = toKebab(entry[0]);
      const value = entry[1];
      if (value === true) {
        return \`--${prefixLower}-$\{name}: 1;\`;
      }else if (!isNaN(value as any)) {
        return \`--${prefixLower}-$\{name}: $\{value};\`;
      }else{
        return \`--${prefixLower}-$\{name}: var( --${prefixLower}-$\{value} );\`;
      }
    }).join('\\n  ')}$\{
    Object.entries(otherStyles).map((entry) => {
      if (!entry[0]) return '';
      const name = toKebab(entry[0]);
      return \`$\{name}: $\{entry[1]};\`;
    }).join('\\n  ')
  }"\`;
}
`
  }
}

export default new TSStyleFile();