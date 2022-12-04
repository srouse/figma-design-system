import {
  DSysLevel,
  DTTokenType,
  TokenGroup,
  DSysCustomTokenset,
  DSysCustomToken,
} from "../../../../shared";
import uid from "../../../utils/uid";

export function addCustomToken(
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void | undefined
) {
  if (!tokenGroup || !updateTokenGroup) return;

  const tokenset = tokenGroup.tokensets[0] as DSysCustomTokenset;
  let newCustomName = 'name';
  while(tokenset[newCustomName] !== undefined) {
    // enough to find something unique, but not too much for user to clean up
    newCustomName = `${newCustomName}-${Math.floor(Math.random()*10000)}`;
  }

  const newCustomToken: DSysCustomToken = {
    $extensions: {
      'dsys.level': DSysLevel.token,
      "dsys.name": newCustomName,
      "dsys.index": 0,// it's the first one...
      "dsys.uid": uid()
    },
    $type: DTTokenType.custom,
    $value: 'new value',
  };

  Object.values(tokenset).map((value: any) => {
    if (
      value &&
      value.$extensions &&
      value.$extensions['dsys.level'] === DSysLevel.token
    ) {
      const token = value as DSysCustomToken;
      token.$extensions["dsys.index"] += 1;
    }
  });
  tokenset[newCustomName] = newCustomToken;

  updateTokenGroup({
    ...tokenGroup,
    tokensets:[tokenset]
  });
}
