import toKebabCase from "../../shared/toKebobCase";
import { colors, typography } from "../../shared/styles";

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

  const css = `
:root {
  ${colorCssVars.join('\n')}
  ${typographyCssVars.join('\n')}
}`;

  return css;
}