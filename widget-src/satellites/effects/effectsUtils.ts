import { DSysGroupType, DSysLevel, DSysTokenset, DTTokenType, rgbFractionToHex, TokenGroup } from "../../../shared/index";
import { FigmaEffectStyle } from "../../../shared/types/types";
import { effectStyles } from "../../actions/getStyles";

export function pullTokensFromEffectStyles(
  tokenGroup: TokenGroup,
  setTokenGroup: (val:TokenGroup) => void,
  nodeId: string,
) {
  const styles = effectStyles(tokenGroup.name);
  const stylesTokenGroup = effectStylesToDSysTokenset(
    styles, tokenGroup.name, nodeId
  );
  if (!stylesTokenGroup) return;
  console.log('stylesTokenGroup',stylesTokenGroup);
  setTokenGroup({
    ...tokenGroup,
    tokensets: [stylesTokenGroup],
  });
}

export function effectStylesToDSysTokenset(
  styles: FigmaEffectStyle[],
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
      'dsys.type': DSysGroupType.EffectSet,
      'dsys.name': name,
      "dsys.nodeId": nodeId,
    },
    $description: `${name} effect tokens`,
  };

  folderStyles.map((style, index) => {
    // sans folder
    let name = style.name.substring(folderName.length+1);
    if (style.effects.length === 0) return;

    if (!name) name = '';
    const effect = style.effects[0];// only the first one...
    console.log(effect);
    console.log(style);
    if (effect.type === 'DROP_SHADOW') {
      tokenset[name] = {
        $extensions: {
          'dsys.level'    : DSysLevel.token,
          'dsys.name'     : name,
          'dsys.index'    : index,
          'dsys.styleId'  : style.id,
        },
        $value: {
          color   : rgbFractionToHex(effect.color),
          alpha   : effect.color.a,
          blur    : effect.radius,
          offsetX : effect.offset.x,
          offsetY : effect.offset.y,
          radius  : effect.radius,
          spread  : effect.spread || 0,
        },
        $type: DTTokenType.shadow
      };
    }else if (effect.type === 'LAYER_BLUR') {
      tokenset[name] = {
        $extensions: {
          'dsys.level'    : DSysLevel.token,
          'dsys.name'     : name,
          'dsys.index'    : index,
          'dsys.styleId'  : style.id,
        },
        $value: {
          radius    : effect.radius,
        },
        $type: DTTokenType.blur
      };
    }
  });

  return tokenset;
}