


export default function luminance(r: number, g: number, b: number) {
  var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
          ? v / 12.92
          : Math.pow( (v + 0.055) / 1.055, 2.4 );
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 // calculate the color contrast ratio
const ratio = color1luminance > color2luminance 
  ? ((color2luminance + 0.05) / (color1luminance + 0.05))
  : ((color1luminance + 0.05) / (color2luminance + 0.05));


const result = `
  AA-level large text: ${ratio < 1/3 ? 'PASS' : 'FAIL' }<br>
  AA-level small text: ${ratio < 1/4.5 ? 'PASS' : 'FAIL' }<br>
  AAA-level large text: ${ratio < 1/4.5 ? 'PASS' : 'FAIL' }<br>
  AAA-level small text: ${ratio < 1/7 ? 'PASS' : 'FAIL' }
  `;

 */