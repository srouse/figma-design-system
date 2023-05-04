import { DSysSheet } from "../../../../../../shared";
import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";

class TSReactStyleFile extends File {

  path: string = 'transformations/fds-web/style-react.ts';

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
import { ${prefixUpper}Prop } from "./css-atoms";
import type * as CSS from 'csstype';

/**
 * ${prefix}
 * Function for dynamically creating and auto-completing
 * ${prefix} design system files.
 * @param {DSysProp} dsysStyles
 * @param {Object} CSS.Properties
 * @return {CSS.Properties}
 */
export default function ${prefixLower}(
  dsysStyles: ${prefixUpper}Prop,
  otherStyles: CSS.Properties = {},
) : CSS.Properties {
  const dsysStylesObj: {[key:\`--${prefix}-$\{string}\`]: string} = {};
  Object.entries(dsysStyles).map((entry) => {
    if (entry[1] === true) {
      dsysStylesObj[\`--${prefixLower}-$\{entry[0]}\`] = '1';
    }else{
      dsysStylesObj[\`--${prefixLower}-$\{entry[0]}\`] = \`var( --${prefixLower}-$\{entry[1]} )\`;
    }
  });
  return {
    ...dsysStylesObj,
    ...otherStyles,
  };
}
`
  }
}

export default new TSReactStyleFile();