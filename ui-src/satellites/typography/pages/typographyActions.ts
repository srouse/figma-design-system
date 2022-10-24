import {
  DSysTypographyToken,
  findToken,
  findTokenViaIndex,
  MessageRequest,
  MessageRequestStyle,
  TokenGroup,
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";

let newStyleId = 0;

export async function addTypographyToken(
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  const result: any = await postMessagePromise(
    MessageRequest.createStyle,
    {
      style: {
        type: MessageRequestStyle.text,
        name: `${tokenGroup.name}/new-text${newStyleId ? `-${newStyleId}` : ''}`,
        value: {
          fontSize    : 12,
          fontName    : {
            family: 'Inter',
            style: 'Regular'
          }
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

export async function deleteTypographyToken(
  deletedToken: DSysTypographyToken,
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
      type: MessageRequestStyle.text,
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