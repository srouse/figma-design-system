import { DSysSvgToken, DSysToken, DTTokenType, findTokensSheet, loopDesignSystemTokens } from "../../../../../../shared";
import { FileCreateResults, GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";

class IconWebComponentFile extends File {

  path: string = 'transformations/fds-web/{prefix}-icon.js';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const dsys = this.fileCreationResults.tokenResults.tokens;
      if (!dsys) return 'no tokens';
      const tokenSheet = findTokensSheet(dsys);
      if (!tokenSheet) return 'no tokensheet';
      const prefix = tokenSheet.$extensions["dsys.prefix"].toLowerCase();
  
      this.path = `transformations/fds-web/${prefix.toLowerCase()}-icon.js`;
      return getContent(
        prefix,
        this.fileCreationResults,
      );
    }else{
      return '/* tokens not found */';
    }
  }
}

function getContent(
  prefix: string,
  fileCreationResults: FileCreateResults,
) {
  if (
    !fileCreationResults ||
    !fileCreationResults.tokenResults
  ) {
    return 'no tokens';
  }
  const iconNames: string[] = [];
  loopDesignSystemTokens(
    fileCreationResults.tokenResults.tokens,
    undefined,
    undefined,
    undefined,
    (token: DSysToken) => {
      if (token.$type === DTTokenType.svg) {
        const iconToken = token as DSysSvgToken;
        iconNames.push(iconToken.$extensions["dsys.name"]);
      }
    },
  );

  return `const template = document.createElement('template');
  template.innerHTML = \`
    <style>
      :host {
        width: 42px;
        height: 42px;
      }
        :host, #root {
          display: inline-block;
        }
          #root, svg {
            width: 100%;
            height: 100%;
          }
            svg, svg * {
              fill: var( --color, #222 ) !important;
            }
        .error {
          font-family: sans-serif;
          font-size: 12px;
          color: #f00;
        }
    </style>
    <div id="root"></div>
  \`;
  
  class ${prefix.toUpperCase()}Icon extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  
    static get observedAttributes() {
      return ['icon'];
    }
  
    async getSvg(icon) {
      let svg;
      switch (icon) {${
        iconNames.map(iconName => {
          return `
        case '${iconName}' :
          svg = await import('./icons/${iconName}.js');
          break;`;
        }).join('')}
      }
      if (svg) {
        this.shadowRoot.querySelector(
          '#root'
        ).innerHTML = svg.default;
      }else{
        this.shadowRoot.querySelector(
          '#root'
        ).innerHTML = '<div class="error">no icon</div>';
      }
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'icon') {
        this.getSvg(newValue);
      }
    }
  }
  
  window.customElements.define('${
    prefix.toLowerCase()
  }-icon', ${
    prefix.toUpperCase()
  }Icon);`;
}


export default new IconWebComponentFile();