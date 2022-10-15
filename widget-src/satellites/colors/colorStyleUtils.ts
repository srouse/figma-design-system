import {
  DSysTokenset,
  DSysLevel,
  DSysGroupType,
  DSysToken,
  DSysColorToken,
  DTTokenType,
  toKebobCase,
  FigmaPaintStyle,
  TokenGroup,
  hexToRgb,
  rgbFractionToHex
} from '../../../shared/index';

export function colorStylesToDSysTokenset(
  styles: FigmaPaintStyle[],
  name: string | undefined,
  nodeId: string,
) : DSysTokenset | false {
  if (!name) return false;

  const folderName = toKebobCase(name);
  const folderStyles = styles.filter(style => {
    return style.name.indexOf(`${folderName}/`) === 0;
  })

  const tokenset: DSysTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.ColorSet,
      'dsys.name': name,
      "dsys.nodeId": nodeId,
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
        'dsys.level'    : DSysLevel.token,
        'dsys.name'     : name,
        'dsys.index'    : index,
        'dsys.styleId'  : style.id,
      },
      $value: { // don't presume how alpha gets utilized...
        hex: rgbFractionToHex(paint.color),
        alpha: paint.opacity,
      },
      $type: DTTokenType.color
    };
  })
  return tokenset;
}

export function colorTokenGroupToStyles(
  tokenGroup: TokenGroup,
) {
  if (!tokenGroup) return;
  tokenGroup.tokensets.map((tokenset: DSysTokenset) => {
    const tokensetArr = Object.entries(tokenset);
    // sort by index so we can reorder relative to other items in list
    tokensetArr.sort((
      a:[string,any],
      b:[string,any]
    ) => {
      const aVal = a[1];
      const bVal = b[1];
      if (
        aVal.$extensions &&
        bVal.$extensions
      ) {
        return aVal.$extensions['dsys.index'] - bVal.$extensions['dsys.index'];
      }
      return 0;// otherwise it doesn't matter..
    });

    let prevStyle : PaintStyle | null = null;
    tokensetArr.map((entry) => {
      const name : string = entry[0];
      const value : any = entry[1];
      if (name.indexOf('$') === 0 || !value) return;

      const token: DSysToken = value as unknown as DSysColorToken;

      // translate color
      let rgb = hexToRgb(token.$value.hex);
      if (!rgb || rgb.length !== 3) {
        rgb = [200,200,200];
      }

      // find style
      let style = figma.getStyleById(
        token.$extensions['dsys.styleId']
      ) as PaintStyle;

      // manipulate style
      if (!style || style.type !== 'PAINT') {
        style = figma.createPaintStyle();
      }
      (style as PaintStyle).paints = [
        {
          type: "SOLID",
          color: {
            r: rgb[0]/255,
            g: rgb[1]/255,
            b: rgb[2]/255,
          },
          opacity: token.$value.alpha,
        }
      ];
      style.name = `${
        tokenGroup.name}/${
        tokenGroup.name}${
        name ? `-${name}` : ''
      }`;

      // move style relative to prev style (was sorted before getting here)
      figma.moveLocalPaintStyleAfter(style, prevStyle);
      prevStyle = style;
    })
  });
}