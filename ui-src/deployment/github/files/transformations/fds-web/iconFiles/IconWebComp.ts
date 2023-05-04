export default function iconWebComp (
  svg: string,
  nodeName: string,
  prefix: string,
) {
  const className = `${prefix.toUpperCase()}${nodeName.replace(/-./g, x=>x[1].toUpperCase())}`;
  const webCompName = `${prefix.toLowerCase()}-icon-${nodeName.toLowerCase()}`;
  return `
const template = document.createElement('template');
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
  <div id="root">${svg}</div>
\`;

class ${className} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define('${webCompName}', ${className});`;
}