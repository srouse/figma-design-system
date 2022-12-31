import { FigmaEffectStyle, FigmaPaintStyle, FigmaTextStyle } from "../../shared/types/types";
import bounceBack from "../utils/postMessagePromise";
import getUniqueStyleName from "./getUniqueStyleName";

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
  dedupNames(styles);
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
  dedupNames(styles);
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

export function textStyles(folder?: string): FigmaTextStyle[] {
  const styles = getLocalTextStyles();
  dedupNames(styles);
  const finalStyles: FigmaTextStyle[] = [];
  styles.map(style => {
    if (folder && style.name.indexOf(`${folder}/`) !== 0) {
      return;
    }

    /*
    Missing: (can find via REST API however...)
    opentypeFlags
    */

    finalStyles.push({
      id: style.id,
      name: style.name,
      type: style.type,
      fontName: style.fontName,
      fontSize: style.fontSize,
      letterSpacing: style.letterSpacing,
      lineHeight: style.lineHeight,
      listSpacing: (style as any).listSpacing,
      paragraphIndent: style.paragraphIndent,
      paragraphSpacing: style.paragraphSpacing,
      textCase: style.textCase,
      textDecoration: style.textDecoration,
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

function dedupNames(styles: {name:string}[]) {
  const nameLookup: {[key:string]:true} = {};
  styles.map(style => {
    if (!nameLookup[style.name]) {
      nameLookup[style.name] = true;
    }else{
      style.name = getUniqueStyleName(style.name, styles);
      nameLookup[style.name] = true;
    }
  })
}