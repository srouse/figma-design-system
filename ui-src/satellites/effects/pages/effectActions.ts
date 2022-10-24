import {
  DSysShadowToken,
  DSysToken,
  findToken,
  findTokenViaIndex,
  MessageRequest,
  MessageRequestStyle,
  TokenGroup,
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";

let newStyleId = 0;

export async function addEffectToken(
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  const result: any = await postMessagePromise(
    MessageRequest.createStyle,
    {
      style: {
        type: MessageRequestStyle.effect,
        name: `${tokenGroup.name}/new-effect${newStyleId ? `-${newStyleId}` : ''}`,
        value: {// shadow is default...
          color   : { r: 0, g: 0, b: 0, a: 0.15 },
          offset  : { x:0, y:0 },
          radius  : 10,
          blur    : 0,
          spread  : 0,
        },
      }
    }
  );
  if (result.success) {
    if (refreshTokens) await refreshTokens();
  }
  newStyleId += 1;
  return result;
}

export async function deleteEffectToken(
  deletedToken: DSysShadowToken,// works for blur as well...
  refreshTokens: () => void
) {
  await postMessagePromise(
    MessageRequest.deleteStyle,
    {styleId: deletedToken.$extensions['dsys.styleId']}
  );
  if (refreshTokens) await refreshTokens();
  return true;
}

export async function changeOrder(
  movedRowIndex: number,
  newIndex: number,
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  let prevToken = findTokenViaIndex(newIndex, tokenGroup);
  if (newIndex < movedRowIndex) {
    prevToken = findTokenViaIndex(newIndex-1, tokenGroup);
  }
  const token = findTokenViaIndex(movedRowIndex, tokenGroup);
  if (!token) return;// doesn't matter if prevToken exists..
  await postMessagePromise(
    MessageRequest.moveStyle,
    {
      type: MessageRequestStyle.effect,
      styleId: token.$extensions['dsys.styleId'],
      previousStyleId: prevToken ? prevToken.$extensions['dsys.styleId'] : null
    }
  );
  if (refreshTokens) await refreshTokens();
}

export async function changeName(
  newName: string,
  name: string,
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  // find the token in the tokengroup
  if (!tokenGroup) return false;
  const token = findToken(name, tokenGroup);
  if (!token) return false;

  if (token.$extensions['dsys.name'] === newName) return;

  const newToken = {
    ...token,
    '$extensions': {
      ...token.$extensions,
      ['dsys.name']: newName,
    }
  };

  await postMessagePromise(
    MessageRequest.updateStyle,
    {
      token: newToken,
    }
  );
  if (refreshTokens) await refreshTokens();
  return true;
}