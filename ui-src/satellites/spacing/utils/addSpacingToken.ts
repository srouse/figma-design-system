import {
  DSysLevel,
  DTTokenType,
  TokenGroup,
  DSysSpacingTokenset,
  DSysSpacingToken,
} from "../../../../shared";
import uid from "../../../utils/uid";

export function addSpacingToken(
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void | undefined
) {
  if (!tokenGroup || !updateTokenGroup) return;

  const tokenset = tokenGroup.tokensets[0] as DSysSpacingTokenset;
  let newSpaceName = tokenGroup.name || 'spacing';
  while(tokenset[newSpaceName] !== undefined) {
    // enough to find something unique, but not too much for user to clean up
    newSpaceName = `${newSpaceName}-${Math.floor(Math.random()*10000)}`;
  }

  const newSpacingToken: DSysSpacingToken = {
    $extensions: {
      'dsys.level': DSysLevel.token,
      "dsys.name": newSpaceName,
      "dsys.index": 0,// it's the fisrst one...
      "dsys.uid": uid()
    },
    $type: DTTokenType.spacing,
    $value: 1,
  };

  Object.values(tokenset).map((value: any) => {
    if (
      value &&
      value.$extensions &&
      value.$extensions['dsys.level'] === DSysLevel.token
    ) {
      const token = value as DSysSpacingToken;
      token.$extensions["dsys.index"] += 1;
    }
  });
  tokenset[newSpaceName] = newSpacingToken;

  updateTokenGroup({
    ...tokenGroup,
    tokensets:[tokenset]
  });
}
