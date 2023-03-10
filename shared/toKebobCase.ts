export default function toKebobCase(str?: string) {
  let finalStr = '';
  if (str) {
    let matches: any = str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
    if (matches) {
      matches = matches.map((x : any) => x.toLowerCase());
      finalStr = matches.join('-');
    }
  }
  return finalStr;
}