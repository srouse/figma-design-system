import { DSysGroupType, DSysLevel, DSysTokenset, DTFontWeightTokenValues, DTTokenType, TokenGroup } from "../../../shared/index";
import { FigmaLetterSpacing, FigmaLineHeight, FigmaTextStyle } from "../../../shared/types/types";
import { textStyles } from "../../actions/getStyles";


export function pullTokensFromTextStyles(
  tokenGroup: TokenGroup,
  setTokenGroup: (val:TokenGroup) => void,
  nodeId: string,
) {
  const styles = textStyles(tokenGroup.name);
  const stylesTokenGroup = textStylesToDSysTokenset(
    styles, tokenGroup.name, nodeId
  );
  if (!stylesTokenGroup) return;
  console.log('stylesTokenGroup',stylesTokenGroup);
  setTokenGroup({
    ...tokenGroup,
    tokensets: [stylesTokenGroup],
  });
}



export function textStylesToDSysTokenset(
  styles: FigmaTextStyle[],
  name: string | undefined,
  nodeId: string,
) : DSysTokenset | false {
  if (!name) return false;

  const folderName = name;
  const folderStyles = styles.filter(style => {
    return style.name.indexOf(`${folderName}/`) === 0;
  })

  const tokenset: DSysTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.TypographySet,
      'dsys.name': name,
      "dsys.nodeId": nodeId,
    },
    $description: `${name} typography tokens`,
  };

  folderStyles.map((style, index) => {
    // sans folder
    let name = style.name.substring(folderName.length+1);
    if (!name) name = '';
    tokenset[name] = {
      $extensions: {
        'dsys.level'    : DSysLevel.token,
        'dsys.name'     : name,
        'dsys.index'    : index,
        'dsys.styleId'  : style.id,
      },
      $value: {
        fontFamily: style.fontName.family,
        fontStyle: getFontStyle(style.fontName.style),
        figmaFontObj: {...style.fontName},
        fontWeight: getFontWeight(style.fontName.style),
        fontSize: style.fontSize,
        letterSpacing: getLetterSpacing(
          style.letterSpacing,
          style.fontSize,
        ),
        lineHeight: getLineHeight(
          style.lineHeight,
          style.fontSize,
        ),
        listSpacing: style.listSpacing,
        paragraphIndent: style.paragraphIndent,
        paragraphSpacing: style.paragraphSpacing,
        textCase: style.textCase.toLowerCase() as any,
        textDecoration: style.textDecoration.toLowerCase() as any,
      },
      $type: DTTokenType.typography
    };
  });

  return tokenset;
}


const fontWeights: {[key:string]: DTFontWeightTokenValues} = {
  'hairline': 100,
  'thin': 100,
  'extralight': 200,
  'ultralight': 200,
  'light': 300,
  'normal': 400,
  'regular': 400,
  'medium': 500,
  'semibold': 600,
  'demibold': 600,
  'bold': 700,
  'extrabold': 800,
  'ultrabold': 800,
  'black': 900,
  'heavy': 900,
  'extrablack': 950,
  'ultrablack': 950,
}

// "Condensed Ultra Light", "Italic Extra Bold"
function getFontWeight(
  fontStyle: string
): DTFontWeightTokenValues {
  const finalFontStyle = fontStyle.toLowerCase().replace(/[^a-z]/, '');

  const weight = Object.entries(fontWeights).find(fontWeight => {
    const name = fontWeight[0];
    return (finalFontStyle.indexOf(name) !== -1);
  })

  return weight ? weight[1] : 400;// or just normal
}

const fontStyles = ['italic', 'normal', 'oblique'];
function getFontStyle(
  fontStyle: string
): string {
  const finalFontStyle = fontStyle.toLowerCase().replace(/[^a-z]/, '');

  const style = fontStyles.find(fontStyle => {
    return (finalFontStyle.indexOf(fontStyle) !== -1);
  })

  return style ? style : 'normal';// or just normal
}

function getLetterSpacing(
  letterSpacing: FigmaLetterSpacing,
  fontSize: number,
) : string {
  const lowerLetterSpacingUnit = letterSpacing.unit.toLowerCase();
  if (lowerLetterSpacingUnit === 'percent') {
    return `${(fontSize * (letterSpacing.value * .01)).toFixed(4)}px`;
  }else if (lowerLetterSpacingUnit === 'pixels') {
    return `${letterSpacing.value}px`;
  }
  return '0px';
}

function getLineHeight(
  lineHeight: FigmaLineHeight,
  fontSize: number,
) : string {
  const lowerLetterSpacingUnit = lineHeight.unit.toLowerCase();
  if (lowerLetterSpacingUnit === 'auto') {
    return 'normal';
  }

  // we know it has a value now...
  const lineHeightValue = (lineHeight as any).value;
  if (lowerLetterSpacingUnit === 'percent') {
    return `${(fontSize * (lineHeightValue * .01)).toFixed(4)}px`;
  }else if (lowerLetterSpacingUnit === 'pixels') {
    return `${lineHeightValue}px`;
  }
  return 'normal';
}