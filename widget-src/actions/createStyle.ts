import { MessageRequestStyle } from "../../shared/index";
import bounceBack from "../utils/postMessagePromise";
const { 
  getLocalPaintStyles,
  getLocalEffectStyles,
  getLocalTextStyles,
} = figma;

export default function createStyle(
  message: any,
) {
  if (message.style) {

    // COLOR
    if (message.style.type === MessageRequestStyle.color) {
      const name = message.style.name;
      // check for dups...
      const paintStyles = getLocalPaintStyles();
      const prevStyle = paintStyles.find(paintStyle => {
        return paintStyle.name === name;
      });
      if (prevStyle) {
        return bounceBack(message, {
          success: false,
          message: 'Should avoid making styles with duplicate names.'
        });
      }

      const style = figma.createPaintStyle();
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
      style.name = name;
      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });

    // EFFECT
    } else if (message.style.type === MessageRequestStyle.effect) {
      const name = message.style.name;
      // check for dups...
      const effectStyles = getLocalEffectStyles();
      const prevStyle = effectStyles.find(effectStyle => {
        return effectStyle.name === name;
      });
      if (prevStyle) {
        return bounceBack(message, {
          success: false,
          message: 'Should avoid making styles with duplicate names.'
        });
      }

      const style = figma.createEffectStyle();
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
      style.name = name;
      return bounceBack(message, {
        success: true,
        style,
        message: 'succesfully created style',
      });

    // TEXT
    } else if (message.style.type === MessageRequestStyle.text) {
      const name = message.style.name;
      // check for dups...
      const textStyles = getLocalTextStyles();
      const prevStyle = textStyles.find(textStyle => {
        return textStyle.name === name;
      });
      if (prevStyle) {
        return bounceBack(message, {
          success: false,
          message: 'Should avoid making styles with duplicate names.'
        });
      }

      // just enough to make one...
      const style = figma.createTextStyle();
      style.fontSize = message.style.value.fontSize;
      style.fontName = message.style.value.fontName;

      style.name = name;
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