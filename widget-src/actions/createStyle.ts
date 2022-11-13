import { MessageRequestStyle } from "../../shared/index";
import bounceBack from "../utils/postMessagePromise";
import getUniqueStyleName from "./getUniqueStyleName";
const { 
  getLocalPaintStyles,
  getLocalEffectStyles,
  getLocalTextStyles,
  loadFontAsync,
} = figma;

/**
 * createStyle
 */
export default async function createStyle(
  message: any,
) {
  if (message.style) {

    // COLOR
    if (message.style.type === MessageRequestStyle.color) {
      const style = figma.createPaintStyle();
      style.name = getUniqueStyleName(
        message.style.name,
        getLocalPaintStyles(),
      );
      style.paints = [
        {
          type: "SOLID",
          color: {
            r: message.style.value.r/255,
            g: message.style.value.g/255,
            b: message.style.value.b/255,
          }
        }
      ];
      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });

    // EFFECT SHADOW
    } else if (message.style.type === MessageRequestStyle.shadow) {
      const style = figma.createEffectStyle();
      style.name = getUniqueStyleName(
        message.style.name,
        getLocalEffectStyles(),
      );
      style.effects = [
        {
          type      : 'DROP_SHADOW',
          color     : message.style.value.color,
          offset    : message.style.value.offset,
          radius    : message.style.value.radius,
          spread    : message.style.value.spread,
          visible   : true,
          blendMode : 'NORMAL',
        }
      ];

      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });

    // EFFECT BLUR
    } else if (message.style.type === MessageRequestStyle.blur) {
      const style = figma.createEffectStyle();
      style.name = getUniqueStyleName(
        message.style.name,
        getLocalEffectStyles(),
      );
      style.effects = [
        {
          type      : 'LAYER_BLUR',
          radius    : message.style.value.radius,
          visible   : true,
        }
      ];
      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });

    // TEXT
    } else if (message.style.type === MessageRequestStyle.text) {
      // just enough to make one...
      const style = figma.createTextStyle();
      style.name = getUniqueStyleName(
        message.style.name,
        getLocalTextStyles(),
      );
      await loadFontAsync(message.style.value.fontName);
      style.fontName = message.style.value.fontName;
      style.fontSize = message.style.value.fontSize;
      console.log(`done creating ${message.style.name}`);
      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });
    }else{
      return bounceBack(message, {
        success: false,
        message: 'no style requested'
      });
    }
  }
  return bounceBack(message, {
    success: false,
    message: 'no style'
  });
}

