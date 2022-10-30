

const loadedFonts: {[key:string]:true} = {};

export default function loadGoogleFont(fontFamily: string) {
  const finalFontFamily = fontFamily.replace(/ /g, '+');
  if (!loadedFonts[finalFontFamily]) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${finalFontFamily}`;
    document.getElementsByTagName('head')[0].appendChild(link);
    loadedFonts[finalFontFamily] = true;
  }
}
