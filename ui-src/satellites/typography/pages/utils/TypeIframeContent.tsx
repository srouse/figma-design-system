import {
  DTTypographyToken,
  typeTokenToGoogleFontsUrl,
} from "../../../../../shared";

export default function typeIframeContent(
  token: DTTypographyToken,
  exampleText: string = "Ag",
  maxSize: number = 34,
  padding: number = 0,
) {

  const loadedLetters = `${
    exampleText.toUpperCase()}${
      exampleText.toLowerCase()
  }`;

  const googleFontsUrl = typeTokenToGoogleFontsUrl(
    token,
    loadedLetters,
  );

  return `
    <html>
      <head>
      <link
        rel="stylesheet"
        href="${googleFontsUrl}"
      />
      <script>
        fetch("${googleFontsUrl}")
          .then(response=>{
              // cons ole.log('found font:', response.ok);
              response.text();
              document.body.classList.add('show');
          })
          .catch(err => {
              if (err instanceof TypeError) {
                  // Handle this normally
              } else {
                  // Execute other logic depending on the type of error you are receiving
              }
              document.querySelector("#error").innerHTML = "Font not on Google";
              document.querySelector("#example").innerHTML = "";
              document.body.classList.add('error');
          });
      </script>
      <style>
        html, body {
          width: 100vw; height: 100vh;
          overflow: hidden;
          padding: 0; margin: 0;
          text-align: center;
        }
        html {
          font-family     : ${token.$value.figmaFontObj.family};
          font-style      : ${token.$value.fontStyle};
          font-weight     : ${token.$value.fontWeight};
          letter-spacing  : ${token.$value.letterSpacing.value}px;
          line-height     : ${token.$value.lineHeight.unit === 'AUTO' ? 
              token.$value.lineHeight.unit :
              `${token.$value.lineHeight.unit === 'PIXELS' ? 
                  `${token.$value.lineHeight.value || 0}px` : 
                  `${token.$value.lineHeight.value || 0}%`}`};
          font-size       : ${Math.min( maxSize, token.$value.fontSize )}px;
          text-transform  : ${token.$value.textCase === 'UPPER' ? 
            'uppercase' : 
            token.$value.textCase === 'LOWER' ?
            'lowercase' : 
            token.$value.textCase === 'TITLE' ?
            'capitalize' : 'none'};
          text-decoration  : ${token.$value.textDecoration === 'STRIKETHROUGH' ?
            'line-through' : token.$value.textDecoration};
          color: #222222;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${padding}px;
          box-sizing: border-box;
        }
        #error {
          font-family: sans-serif;
          font-size: 14px;
        }
        #example {
          display: none;
        }
        body.show #example{
          display: block;
        }
        body {
          background-color: #efefef;
        }
        body.show {
          background-color: #ffffff;
        }
      </style>
      </head>
      <body>
        <div id="error"></div>
        <div id="example">${exampleText}</div>
      </body>
    </html>`;
}