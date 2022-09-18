import toKebabCase from "../../shared/toKebobCase";
import { colors, typography } from "../../shared/styles";

export function renderCssVariables() {
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
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`)
}