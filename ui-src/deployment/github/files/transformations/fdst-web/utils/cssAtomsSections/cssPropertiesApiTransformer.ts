export const dog = 'test';

/**
import {
  GroupIds,
  Hooks,
  TokenPattern,
  TokenSheet,
  TransformationRuleset,
  TransformationsSheet,
  TransformationsSheetType
} from "../../types";
import { createSizeMetrics } from "./sections/sizeMetrics";
import { createLayouts } from "./sections/layouts";
import { createAlignments } from "./sections/alignment";
import { findGroupViaType } from "../../utils/tokenSheetAccessors";
import { createColors } from "./sections/colors";
import { createFont } from "./sections/font";

export default function transform (
  tokens : TokenSheet,
  isScss: boolean,
  hooks: Hooks,
  variableTransformation: TransformationsSheet,
) : TransformationsSheet {

  const transformationSheet : TransformationsSheet = {
    type: TransformationsSheetType.CSS_RULESETS,
    fileName: 'cssPropertiesApi',
    extension: `${isScss ? 'scss' : 'css'}`,
    jsonExtension: `${isScss ? '.scss.json' : '.css.json'}`,
    createSourceFile: true,
    lookup:{},
    output: "",
    styleComponents: {},
    outputSegments: {},
    outputSegmentsSuffix: '-css',
  };

  const output: string[] = [];
  const properties : string[] = [];
  output.push(`
    ${createColors(tokens.prefix, undefined, properties)}
    ${createFont(tokens.prefix, tokens, undefined, properties)}
    ${createSizeMetrics(tokens.prefix, undefined, properties)}
    ${createLayouts(tokens.prefix, undefined, properties)}
    ${createAlignments(tokens.prefix, undefined, properties)}
  `);

  const breakpointGroup = findGroupViaType( tokens, GroupIds.BREAKPOINTS );
  if (breakpointGroup) {
    breakpointGroup.patterns.map( ( breakpoint : TokenPattern ) => {
      output.push(`
        ${createColors(tokens.prefix, breakpoint, properties)}
        ${createFont(tokens.prefix, tokens, breakpoint, properties)}
        ${createSizeMetrics(tokens.prefix, breakpoint, properties)}
        ${createLayouts(tokens.prefix, breakpoint, properties)}
        ${createAlignments(tokens.prefix, breakpoint, properties)}
      `);
    })
  }

  const propValues: string[] = [];
  Object.values(variableTransformation.lookup).map(lookupValue => {
    Object.values(lookupValue).map(rulesetValue => {
      const ruleset = rulesetValue as TransformationRuleset;
      if (ruleset.property)
        propValues.push( ruleset.property.replace(`--${tokens.prefix}-`, '') );
    })
  })

  transformationSheet.otherFiles = [{
    fileName: 'cssPropertiesApi',
    output: `
/* eslint-disable */
/**
 * ${tokens.prefix}
 * Function for dynamically creating and auto-completing
 * ${tokens.prefix} design system files.
 * @param {DSysProp} dsysStyles
 * @param {Object} otherStyles
 * @return {string}
 * /
export default function ${tokens.prefix}(
  dsysStyles: DSysProp,
  otherStyles: {[prop:string]: string} = {},
) {
  return \`style="$\{
    Object.entries(dsysStyles).map((entry) => {
      if (entry[1] === true) {
        return \`--${tokens.prefix}-$\{entry[0]}: 1;\`;
      }else{
        return \`--${tokens.prefix}-$\{entry[0]}: var( --${tokens.prefix}-$\{entry[1]} );\`;
      }
    }).join('\\n  ')}$\{
    Object.entries(otherStyles).map((entry) => {
      return \`$\{entry[0]}: $\{entry[1]};\`;
    }).join('\\n  ')
  }"\`;
}

export type DSysProp = {
  ${properties.map(prop => {
    return `${snakeToCamel(prop)}? : DSysValue`;
  }).join(',\n  ')}
};

type DSysValue =
  '${propValues.join(`' |\n  '`)
  }' |
  true

`,
    extension: 'ts',
    minimize: false
  }];

  transformationSheet.output = output.join('\n');
  return transformationSheet
}

const snakeToCamel = (str: string) =>
  str.toLowerCase().replace(/([-_][a-z])/g, group =>
    group
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

  */