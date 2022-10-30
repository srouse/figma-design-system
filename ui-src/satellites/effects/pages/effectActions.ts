import {
  DSysBlurToken,
  DSysShadowToken,
  findToken,
  findTokenViaIndex,
  MessageRequest,
  MessageRequestStyle,
  TokenGroup,
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";

/**
 * addEffectToken
 */
export async function addShadowEffectToken(
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  const result: any = await postMessagePromise(
    MessageRequest.createStyle,
    {
      style: {
        type: MessageRequestStyle.shadow,
        name: `${tokenGroup.name}/new-effect`,
        value: {
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
  return result;
}

/**
 * addBlurToken
 */
 export async function addBlurEffectToken(
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  const result: any = await postMessagePromise(
    MessageRequest.createStyle,
    {
      style: {
        type: MessageRequestStyle.blur,
        name: `${tokenGroup.name}/new-effect`,
        value: {
          radius  : 10,
        },
      }
    }
  );
  if (result.success) {
    if (refreshTokens) await refreshTokens();
  }
  return result;
}

/**
 * deleteEffectToken
 */
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

/**
 * changeOrder
 */
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

  if (!token) {
    return;// doesn't matter if prevToken exists..
  }

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

/**
 * changeName
 */
export async function changeName(
  newName: string,
  name: string,
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void,
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

/**
 * updateEffect
 */
export async function updateEffect(
  token: DSysShadowToken | DSysBlurToken,
  refreshTokens: () => void,
) {
  await postMessagePromise(
    MessageRequest.updateStyle,
    {
      token,
    }
  );
  if (refreshTokens) await refreshTokens();
}