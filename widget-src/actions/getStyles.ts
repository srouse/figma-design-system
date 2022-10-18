import { FigmaEffectStyle, FigmaPaintStyle } from "../../shared/types/types";
import bounceBack from "../utils/postMessagePromise";

const { 
  getLocalPaintStyles,
  getLocalTextStyles,
  getLocalEffectStyles,
} = figma;

export default function getStyles(message: any) {
  // objects are not full when sent without mapping
  bounceBack(message, {
    paint: paintStyles(),
    text: _textStyles(),
    effects: _effectStyle(),
  });
}

export function getColorStyles(message: any) {
  // objects are not full when sent without mapping
  bounceBack(message, {
    paint: paintStyles(),
  });
}

export function paintStyles(folder?: string): FigmaPaintStyle[] {
  const styles = getLocalPaintStyles();
  const finalStyles: FigmaPaintStyle[] = [];
  styles.map(style => {
    if (folder && style.name.indexOf(`${folder}/`) !== 0) {
      return;
    }
    finalStyles.push({
      id: style.id,
      name: style.name,
      type: style.type,
      paints: style.paints as any
    });
  });
  return finalStyles;
}

export function effectStyles(folder?: string): FigmaEffectStyle[] {
  const styles = getLocalEffectStyles();
  const finalStyles: FigmaEffectStyle[] = [];
  styles.map(style => {
    if (folder && style.name.indexOf(`${folder}/`) !== 0) {
      return;
    }
    finalStyles.push({
      id: style.id,
      name: style.name,
      type: style.type,
      effects: style.effects as any,
    });
  });
  return finalStyles;
}

export function getTextStyles(message: any) {
  // objects are not full when sent without mapping
  bounceBack(message, {
    text: _textStyles(),
  });
}

function _textStyles() {
  return getLocalTextStyles().map(style => {
    return {
      id: style.id,
      name: style.name,
      type: style.type,
      fontName: style.fontName,
      fontSize: style.fontSize,
      letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight,
      // listSpacing: style.listSpacing,
      paragraphIndent: style.paragraphIndent,
      textCase: style.textCase,
      textDecoration: style.textDecoration,
    }
  });
}

export function getEffectStyles(message: any) {
  // objects are not full when sent without mapping
  bounceBack(message, {
    text: _effectStyle(),
  });
}

function _effectStyle() {
  return getLocalEffectStyles().map(style => {
    return {
      id: style.id,
      name: style.name,
      type: style.type,
      effects: style.effects,
    }
  });
}