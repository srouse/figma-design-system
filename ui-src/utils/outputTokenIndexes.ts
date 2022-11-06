import { DSysTokenset, isToken } from "../../shared";


export default function outputTokenIndexes(
  tokenset: DSysTokenset
) {
  const indexes: number[] = [];
  Object.values(tokenset).map((value: any) => {
    if (isToken(value)) { 
      indexes.push(value.$extensions['dsys.index'])
    }
  });

  window[`con${'sole'}`].log(
    'outputTokenIndexes',
    indexes,
    [...indexes].sort((a, b) => a - b),
  );
}