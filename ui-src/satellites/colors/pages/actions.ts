import {
  DSysColorToken,
  DSysTokenset,
  TokenGroup
} from "../../../../shared";

export function changeColorAction(
  color: string,
  alpha: number,
  name: string,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (val: TokenGroup) => void
) {
  // find the token in the tokengroup
  if (!tokenGroup || !updateTokenGroup) return;
  const tokenset = tokenGroup.tokensets[0];
  const token = findToken(name, tokenGroup);
  if (!token) return;

  const newToken: DSysColorToken = {
    ...token,
    $value: {
      hex: color,
      alpha: alpha,
    }
  };
  const newTokenSet : DSysTokenset = {
    ...tokenset
  };
  newTokenSet[name] = newToken;
  // now weave back together...
  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet],
  });
}

export function changeNameAction(
  newName: string,
  name: string,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (val: TokenGroup) => void
) {
  // find the token in the tokengroup
  if (!tokenGroup || !updateTokenGroup) return;
  const tokenset = tokenGroup.tokensets[0];
  const token = findToken(name, tokenGroup);
  if (!token) return;

  const newToken: DSysColorToken = {
    ...token,
    $extensions: {
      ...token.$extensions,
      "dsys.name": newName,
    }
  };
  const newTokenSet : DSysTokenset = {
    ...tokenset
  };
  newTokenSet[newName] = newToken;
  delete newTokenSet[name];

  // now weave back together...
  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet],
  });
}

function findToken(
  name: string,
  tokenGroup: TokenGroup,
) : DSysColorToken | void {
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