import {
  DSysToken,
  DTTokenType,
  hexToRgb,
  TokenGroup,
  validColor
} from "../../shared/index";
import {
  hexAndAlphaToRGBAObj,
  RGBType
} from "../../shared/utils/colorUtils";
import bounceBack from "../utils/postMessagePromise";
import getUniqueStyleName from "./getUniqueStyleName";
const { 
  getLocalPaintStyles,
  getLocalEffectStyles,
  getLocalTextStyles,
} = figma;

/**
 * updateStyle
 */
export function updateStyle(
  message: any,
  tokenGroup: TokenGroup,
) {
  const token = message.token as DSysToken;
  if (!tokenGroup || !token) {
    return bounceBack(message, {
      success: false,
      message: 'did NOT get a token or token group',
    });
  }

  if (token.$type === DTTokenType.color) {
    const style = figma.getStyleById(
      token.$extensions['dsys.styleId']
    ) as PaintStyle;
    if (style && style.type === 'PAINT') {
      if (validColor(token.$value)) {
        const rgb = hexToRgb(token.$value.hex);
        if (rgb) {
          style.paints = [
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
          style.name = getUniqueStyleName(
            `${tokenGroup.name}/${token.$extensions['dsys.name']}`,
            getLocalPaintStyles(),
            style
          );
          return bounceBack(message, {
            success: true,
          });
        }
        return bounceBack(message, {
          success: false,
          message: 'color not valid',
        });
      }
      return bounceBack(message, {
        success: false,
        message: 'color not valid',
      });
    }
  } else if (token.$type === DTTokenType.shadow) {
    const style = figma.getStyleById(
      token.$extensions['dsys.styleId']
    ) as EffectStyle;

    if (style && style.type === 'EFFECT') {
      style.effects = [{
        type: 'DROP_SHADOW',
        color: hexAndAlphaToRGBAObj(
          token.$value.color,
          token.$value.alpha,
          RGBType.base1,
        ),
        offset: {
          x: token.$value.offsetX,
          y: token.$value.offsetY,
        },
        spread: token.$value.spread,
        radius: token.$value.blur,
        visible: true,
        blendMode: 'NORMAL',
      }];
      style.name = getUniqueStyleName(
        `${tokenGroup.name}/${token.$extensions['dsys.name']}`,
        getLocalEffectStyles(),
        style
      );
      return bounceBack(message, {
        success: true,
      });
    }
  } else if (token.$type === DTTokenType.blur) {
    const style = figma.getStyleById(
      token.$extensions['dsys.styleId']
    ) as EffectStyle;
    if (style && style.type === 'EFFECT') {
      style.effects = [{
        type: 'LAYER_BLUR',
        radius: token.$value.radius,
        visible: true,
      }];
      style.name = getUniqueStyleName(
        `${tokenGroup.name}/${token.$extensions['dsys.name']}`,
        getLocalEffectStyles(),
        style
      );
      return bounceBack(message, {
        success: true,
      });
    }
  } else if (token.$type === DTTokenType.typography) {
    const style = figma.getStyleById(
      token.$extensions['dsys.styleId']
    ) as TextStyle;
    if (style && style.type === 'TEXT') {
      // TODO...
      style.fontSize = token.$value.fontSize;
      style.letterSpacing = token.$value.letterSpacing;
      style.lineHeight = token.$value.lineHeight;
      style.name = getUniqueStyleName(
        `${tokenGroup.name}/${token.$extensions['dsys.name']}`,
        getLocalTextStyles(),
        style
      );
      return bounceBack(message, {
        success: true,
      });
    }
  }

  return bounceBack(message, {
    success: false,
    message: 'style not found ( or supported )'
  });
}