import { MessageRequestStyle } from "../../shared/index";
import bounceBack from "../utils/postMessagePromise";

export default function moveStyle(
  message: any
) {
  if (message.type === MessageRequestStyle.color) {
    const targetStyle = figma.getStyleById(message.styleId) as PaintStyle;
    const previousStyle = figma.getStyleById(message.previousStyleId) as PaintStyle;
    if (!targetStyle) return;

    if (targetStyle === previousStyle) {
      // not doing anything is a right answer here
      return bounceBack(message, {success: true});
    }
    
    figma.moveLocalPaintStyleAfter(
      targetStyle, previousStyle || null
    );
    return bounceBack(message, {success: true});
  }else if (message.type === MessageRequestStyle.effect) {
    const targetStyle = figma.getStyleById(message.styleId) as EffectStyle;
    const previousStyle = figma.getStyleById(message.previousStyleId) as EffectStyle;
    if (!targetStyle) return;

    if (targetStyle === previousStyle) {
      // not doing anything is a right answer here
      return bounceBack(message, {success: true});
    }
    
    figma.moveLocalEffectStyleAfter(
      targetStyle, previousStyle || null
    );
    return bounceBack(message, {success: true});
  }else if (message.type === MessageRequestStyle.text) {
    const targetStyle = figma.getStyleById(message.styleId) as TextStyle;
    const previousStyle = figma.getStyleById(message.previousStyleId) as TextStyle;
    if (!targetStyle) return;

    if (targetStyle === previousStyle) {
      // not doing anything is a right answer here
      return bounceBack(message, {success: true});
    }
    
    figma.moveLocalTextStyleAfter(
      targetStyle, previousStyle || null
    );
    return bounceBack(message, {success: true});
  }
  return bounceBack(message, {success: false, message: 'no type found'});
}