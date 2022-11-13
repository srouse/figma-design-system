import {
  TokenGroup,
  DSysToken,
  DSysColorToken,
  isToken,
} from '../index';

export default function findToken(
  name: string,
  tokenGroup: TokenGroup,
) : DSysToken | void {
  // find the token in the tokengroup
  const tokenset = tokenGroup.tokensets[0];
  if (!tokenset) return;
  const tokenEntry = Object.entries(tokenset).find(entry => {
    return entry[0] === name;
  });
  if (!tokenEntry) return;
  const token = tokenEntry[1];// pulling from an entry
  if (!token) return;
  return token;
}

export function findTokenViaStyleId(
  styleId: string,
  tokenGroup: TokenGroup,
) : DSysToken | void {
  // find the token in the tokengroup
  const tokenset = tokenGroup.tokensets[0];
  if (!tokenset) return;
  const tokenEntry = Object.entries(tokenset).find(entry => {
    const token = entry[1] as DSysColorToken;
    if (!isToken(token)) return false;
    return token.$extensions['dsys.styleId'] === styleId;
  });
  if (!tokenEntry) return;
  const token = tokenEntry[1];// pulling from an entry
  if (!token) return;
  return token;
}