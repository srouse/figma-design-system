import { DTTypographyToken } from "../../../../../shared";

export default function typeIframeContent(
  token: DTTypographyToken,
  exampleText: string = "Ag",
  maxSize: number = 34,
) {

  const style = token.$value.figmaFontObj.style.toLowerCase();
  const styleArr = style.split(' ');
  
  const allCombos = styleArr.flatMap(
    (v, i) => styleArr.slice(i+1).map( w => v + w )
  );
  const finalStyles = [
    ...styleArr,
    ...allCombos
  ];
  if (styleArr.length > 2) {
    finalStyles.push(style.replace(/ /g, ''))
  }

  const loadedLetters = `${
    exampleText.toUpperCase()}${
      exampleText.toLowerCase()
  }`;

  return `
    <html>
      <head>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=${
          token.$value.fontFamily.replace(/ /g, '+')}:${
          finalStyles.join(',')
        }&display=swap&subset=latin&text=${loadedLetters}"
      />
      <style>
        html, body {
          width: 100vw; height: 100vh;
          overflow: hidden;
          padding: 0; margin: 0;
          text-align: center;
        }
        html {
          font-family     : '${token.$value.fontFamily}';
          font-style      : ${token.$value.fontStyle};
          font-weight     : ${token.$value.fontWeight};
          letter-spacing  : $ {token.$value.letterSpacing}px;
          line-height     : $ {token.$value.lineHeight}px;
          font-size       : ${Math.min( maxSize, token.$value.fontSize )}px;
          text-transform  : ${token.$value.textCase === 'upper' ? 
            'uppercase' : 
            token.$value.textCase === 'lower' ?
            'lowercase' : 
            token.$value.textCase === 'title' ?
            'capitalize' : 'none'};
          text-decoration  : ${token.$value.textDecoration === 'strikethrough' ?
            'line-through' : token.$value.textDecoration};
          color: #222222;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
      </head>
      <body>
        ${exampleText}
      </body>
    </html>`;
}