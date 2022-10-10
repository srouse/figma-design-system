import {
  DSysTokenset,
  DSysLevel,
  DSysGroupType,
  DTTokenType,
} from '../index';
import toKebobCase from '../toKebobCase';
import {
  FigmaPaintStyle
} from '../types/types';
import { rgbFractionToHex } from './colorUtils';


export function stylesToDSysTokenset(
  styles: FigmaPaintStyle[],
  name: string | undefined,
) {
  if (!name) return;

  const folderName = toKebobCase(name);
  const folderStyles = styles.filter(style => {
    return style.name.indexOf(`${folderName}/`) === 0;
  })

  const tokenset: DSysTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.ColorSet,
      'dsys.name': name,
      "dsys.nodeId": '3233'
    },
    $description: 'primary color set',
  };

  folderStyles.map((style, index) => {
    // sans folder
    let name = style.name.substring(folderName.length+1);
    if (
      name.indexOf(`${folderName}-`) === 0 ||
      name === folderName
    ) {
      name = name.substring(folderName.length+1);
    }
    if (style.paints.length === 0) return;

    if (!name) name = '';
    const paint = style.paints[0];// only the first one...
    tokenset[name] = {
      $extensions: {
        'dsys.level': DSysLevel.token,
        'dsys.name': name,
        'dsys.index' : index,
      },
      $value: { // don't presume how alpha gets utilized...
        hex: rgbFractionToHex(paint.color),
        alpha: paint.opacity,
      },
      $type: DTTokenType.color
    };
  })
  console.log(tokenset);
  return tokenset;
}