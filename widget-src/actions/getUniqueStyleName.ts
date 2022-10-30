

export default function getUniqueStyleName(
  name: string,
  styles: {name:string}[],
  thisStyle?: any
) {
  let finalName = name;
  let prevStyle = styles.find(style => {
    if (thisStyle && style === thisStyle) return false;
    return style.name === finalName;
  });
  while (prevStyle) {
    finalName = `${name}-${Math.round(Math.random()*100000)}`;
    prevStyle = styles.find(style => {
      return style.name === finalName;
    });
    console.log(finalName);
  }
  return finalName;
}