import {
  DSysSpacingToken,
  DSysSpacingTokenset,
  isToken,
  MessageRequest,
  TokenGroup
} from "../../../../shared";
import outputTokenIndexes from "../../../utils/outputTokenIndexes";
import postMessagePromise from "../../../utils/postMessagePromise";

export function changeSpacingOrder(
  rowIndex: number,
  dropIndex: number,
  tokenGroup: TokenGroup | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void | undefined
) {
  if (
    rowIndex === dropIndex || 
    !tokenGroup || 
    !updateTokenGroup
  ) return;

  const tokenset = tokenGroup.tokensets[0] as DSysSpacingTokenset;
  Object.values(tokenset).map((value: any) => {
    if (isToken(value)) {
      const token = value as DSysSpacingToken;
      const tokenIndex = token.$extensions['dsys.index'];
      if (tokenIndex === rowIndex) {
        token.$extensions["dsys.index"] = dropIndex;
      }else if (dropIndex > rowIndex) {
        if (
          tokenIndex > rowIndex &&
          tokenIndex <= dropIndex
        ) {
          token.$extensions["dsys.index"] -= 1;
        }
      }else if (dropIndex < rowIndex) {
        if (
          tokenIndex >= dropIndex &&
          tokenIndex < rowIndex
        ) {
          token.$extensions["dsys.index"] += 1;
        }
      }
    }
  });

  // check for mistakes...
  const indexLookup: {[key:string]: true} = {};
  let hasDupIndex = false;
  Object.values(tokenset).map((value: any) => {
    if (isToken(value)) { 
      const index = value.$extensions['dsys.index'];
      if (indexLookup[`i_${index}`] === true) {
        hasDupIndex = true;
      }
      indexLookup[`i_${index}`] = true;
    }
  });
  if (hasDupIndex) {
    console.error('found duplicate order index...reindexing tokens');
    postMessagePromise(
      MessageRequest.notify,
      {
        message: 'found duplicate order index...reindexing tokens',
        error: true,
        // button: true,
      }
    );
    let newIndex = 0;
    Object.values(tokenset).map((value: any, index: number) => {
      if (isToken(value)) { 
        value.$extensions['dsys.index'] = newIndex;
        newIndex++;
      }
    });
  }
  
  outputTokenIndexes(tokenset);

  updateTokenGroup({
    ...tokenGroup,
    tokensets:[tokenset]
  });
}