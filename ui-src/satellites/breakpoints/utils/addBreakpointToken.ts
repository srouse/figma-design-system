import {
  DSysLevel,
  DTTokenType,
  TokenGroup,
  DSysBreakpointTokenset,
  DSysBreakpointToken,
} from "../../../../shared";
import uid from "../../../utils/uid";

export function addBreakpointToken(
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void | undefined
) {
  if (!tokenGroup || !updateTokenGroup) return;

  const tokenset = tokenGroup.tokensets[0] as DSysBreakpointTokenset;
  let newBreakpointName = 'breakpoint-[new]-up';
  while(tokenset[newBreakpointName] !== undefined) {
    // enough to find something unique, but not too much for user to clean up
    newBreakpointName = `${newBreakpointName}-${Math.floor(Math.random()*10000)}`;
  }

  const newBreakpointToken: DSysBreakpointToken = {
    $extensions: {
      'dsys.level': DSysLevel.token,
      "dsys.name": newBreakpointName,
      "dsys.index": 0,// it's the first one...
      "dsys.uid": uid()
    },
    $type: DTTokenType.breakpoint,
    $direction: 'up',
    $value: 0,
  };

  Object.values(tokenset).map((value: any) => {
    if (
      value &&
      value.$extensions &&
      value.$extensions['dsys.level'] === DSysLevel.token
    ) {
      const token = value as DSysBreakpointToken;
      token.$extensions["dsys.index"] += 1;
    }
  });
  tokenset[newBreakpointName] = newBreakpointToken;

  updateTokenGroup({
    ...tokenGroup,
    tokensets:[tokenset]
  });
}
