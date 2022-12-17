import { DSysComponentToken, TokenGroup } from "../../../../shared";


export default function getComponentToken(
  tokenGroup: TokenGroup | undefined
): DSysComponentToken | undefined {
  if (
    tokenGroup &&
    tokenGroup.tokensets &&
    tokenGroup.tokensets.length > 0
  ) {
    const tokenSet = tokenGroup.tokensets[0];
    const token = tokenSet['component'] as DSysComponentToken;
    return token;
  }
  return undefined;
}