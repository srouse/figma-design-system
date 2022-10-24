import {
  TokenGroup,
  DSysColorToken,
  DSysToken,
} from '../index';

export default function findTokenViaIndex(
  index: number,
  tokenGroup: TokenGroup,
) : DSysColorToken | void {
  // find the token in the tokengroup
  const tokenset = tokenGroup.tokensets[0];
  if (!tokenset) return;
  const tokenEntry = Object.entries(tokenset).find(entry => {
    // const name = entry[0];
    // thank you design token standard
    const token = entry[1] as DSysToken;
    if (!token || !token.$extensions) return false;
    return token.$extensions['dsys.index'] === index;
  });
  if (!tokenEntry) return;
  const token = tokenEntry[1];// pulling from an entry
  if (!token) return;

  return token;
}