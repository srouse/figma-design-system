import {
  DSysToken,
  DSysTokenset,
} from "../types/designSystemTypes";

export default function cleanAndSortTokens(
  tokenset: DSysTokenset | undefined
) : [string, DSysToken][] {
  if (!tokenset) return [];

  const tokens = Object.entries(tokenset).filter(entry => {
    const prop = entry[0];
    return (// thank you design token standards...
      prop !== '$description' && 
      prop !== '$extensions'
    ) ? true : false;
  });

  tokens.sort((a, b) => {
    const aToken = a[1] as unknown as DSysToken;
    const bToken = b[1] as unknown as DSysToken;
    const aIndex = aToken.$extensions["dsys.index"];
    const bIndex = bToken.$extensions["dsys.index"];
    if (
      aIndex !== undefined &&
      bIndex !== undefined
    ) {
      return aIndex - bIndex;
    }else{
      return 1;
    }
  });

  return tokens;
}