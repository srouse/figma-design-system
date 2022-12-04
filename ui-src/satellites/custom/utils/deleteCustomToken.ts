import {
  DSysCustomToken,
  isToken,
  TokenGroup,
} from '../../../../shared';

export default function deleteCustomToken(
  token: DSysCustomToken,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (tokenGroup: TokenGroup) => void
) {
  if (!token || !tokenGroup || !updateTokenGroup) return;

  const tokenset = tokenGroup.tokensets[0];
  const deletedIndex = token.$extensions['dsys.index'];
  delete tokenset[token.$extensions['dsys.name']];

  // now reindex
  Object.values(tokenset).map((value: any) => {
    if (isToken(value)) {
      const token = value as DSysCustomToken;
      const tokenIndex = token.$extensions['dsys.index'];
      if (tokenIndex > deletedIndex) {
        token.$extensions['dsys.index'] -= 1;
      }
    }
  });

  // outputTokenIndexes(tokenset);

  updateTokenGroup({
    ...tokenGroup,
    tokensets: [{
      ...tokenset,
    }]
  });
}