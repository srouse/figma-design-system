import {
  TokenGroup,
  DSysCustomToken,
} from "../../../../shared";

export default function updateCustomToken(
  token?: DSysCustomToken,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (tokenGroup: TokenGroup) => void
) {
  if (!token || !tokenGroup || !updateTokenGroup) return;

  const tokenset = tokenGroup.tokensets[0];
  const origTokenEntry = Object.entries(tokenset).find(entry => {
    const name = entry[0];
    const value = entry[1];
    if (name.indexOf('$') === 0) {
      return false;
    }
    const tmpToken = value as DSysCustomToken;
    return tmpToken.$extensions["dsys.uid"] === token.$extensions["dsys.uid"];
  });
  if (!origTokenEntry) return;
  const origToken = origTokenEntry[1] as DSysCustomToken;

  // remove orig in case name changes...
  delete tokenset[origToken.$extensions["dsys.name"]];
  // add new one back in...
  tokenset[token.$extensions["dsys.name"]] = token;

  updateTokenGroup({
    ...tokenGroup,
    tokensets: [{
      ...tokenset,
    }]
  });
}
