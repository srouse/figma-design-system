import { MessageRequestStyle } from "../../shared/index";
import bounceBack from "../utils/postMessagePromise";
const { 
  getLocalPaintStyles,
} = figma;

export default function createStyle(
  message: any,
) {
  if (message.style) {
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