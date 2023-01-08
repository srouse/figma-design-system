import {
  DSysToken,
  DTTokenType,
  DTTypographyToken,
} from '../index';

export default function typeTokenToGoogleFontsUrl(
  token: DSysToken | DTTypographyToken,
  loadedLetters?: string,
) {
  if (token.$type === DTTokenType.typography) {
    const style = token.$value.figmaFontObj.style.toLowerCase();
    const styleArr = style.split(' ');
    
    const allCombos = styleArr.flatMap(
      (v: any, i: any) => styleArr.slice(i+1).map( w => v + w )
    );
    const finalStyles = [
      ...styleArr,
      ...allCombos
    ];
    if (styleArr.length > 2) {
      finalStyles.push(style.replace(/ /g, ''))
    }

    const letters = loadedLetters ? `&text=${loadedLetters}` : '';

    return `https://fonts.googleapis.com/css?family=${
      token.$value.figmaFontObj.family.replace(/ /g, '+')}:${
      finalStyles.join(',')
    }&display=swap&subset=latin${letters}`;
  }
  return undefined;
}