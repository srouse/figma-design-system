import toKebabCase from "../../shared/toKebobCase";
import { colors, effects, sizing, typography } from "../../shared/styles";

export function renderCssVariables() {
  document.head.insertAdjacentHTML("beforeend", `<style>${
    cssVariables()
  }</style>`)
}

export function cssVariables() {
  const colorCssVars = Object.entries(colors).map(entry => {
    return `--${toKebabCase(entry[0])}: ${entry[1]};`;
  });

  const typographyCssVars = Object.entries(typography).map(entry => {
    return `--${toKebabCase(entry[0])}: ${entry[1]};`;
  });

  const sizingCssVars = Object.entries(sizing).map(entry => {
    return `--${toKebabCase(entry[0])}: ${entry[1]};`;
  });

  const effectsCssVars = Object.entries(effects).map(entry => {
    return `--${toKebabCase(entry[0])}: ${entry[1]};`;
  });

  const css = `
:root {
  ${colorCssVars.join('\n')}
  ${typographyCssVars.join('\n')}
  ${sizingCssVars.join('\n')}
  ${effectsCssVars.join('\n')}
}`;

  return css;
}