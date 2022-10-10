
export default function mergeNames(
  name1?: string,// not motivated enought to figure out arguments and ts
  name2?: string,
  name3?: string,
  name4?: string,
  name5?: string,
) {
  const args = [name1, name2, name3, name4, name5];
  const cleanArgs = args.filter(arg => {
    return arg;
  });
  return cleanArgs.join('-');
}