import {
  DSysColorToken,
  DSysToken,
  DSysTokenset,
  MessageRequest,
  MessageRequestStyle,
  TokenGroup
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";

export async function changeColorAction(
  color: string,
  alpha: number,
  name: string,
  tokenGroup?: TokenGroup,
  refreshTokens?: () => void
) {
  // find the token in the tokengroup
  if (!tokenGroup) return false;
  const token = findToken(name, tokenGroup);
  if (!token) return false;

  const newColor = {
    hex: color,
    alpha: alpha,
  };

  if (
    JSON.stringify(token.$value) === 
    JSON.stringify(newColor)
  ) return;

  const newToken = {
    ...token,
    $value: newColor
  };

  console.log('changeColorAction', newToken);
  await postMessagePromise(
    MessageRequest.updateStyle,
    {
      token: newToken,
    }
  );
  if (refreshTokens) await refreshTokens();
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
      type: MessageRequestStyle.color,
      styleId: token.$extensions['dsys.styleId'],
      previousStyleId: prevToken ? prevToken.$extensions['dsys.styleId'] : null
    }
  );
  if (refreshTokens) await refreshTokens();
}

export async function deleteColorToken(
  deletedToken: DSysColorToken,
  refreshTokens: () => void
) {
  await postMessagePromise(
    MessageRequest.deleteStyle,
    {styleId: deletedToken.$extensions['dsys.styleId']}
  );
  if (refreshTokens) await refreshTokens();
  return true;
}

export async function addColorToken(
  tokenGroup: TokenGroup | undefined,
  refreshTokens: () => void
) {
  if (!tokenGroup) return;
  const result: any = await postMessagePromise(
    MessageRequest.createStyle,
    {
      style: {
        type: MessageRequestStyle.color,
        name: `${tokenGroup.name}/new-color`,
        value: {
          r: 200, g: 200, b: 200,
        },
      }
    }
  );
  if (result.success) {
    if (refreshTokens) await refreshTokens();
  }
  return result;
}

export async function changeNameAction(
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

function findToken(
  name: string,
  tokenGroup: TokenGroup,
) : DSysColorToken | void {
  // find the token in the tokengroup
  const tokenset = tokenGroup.tokensets[0];
  if (!tokenset) return;
  const tokenEntry = Object.entries(tokenset).find(entry => {
    return entry[0] === name;
  });
  if (!tokenEntry) return;
  const token = tokenEntry[1];// pulling from an entry
  if (!token) return;
  return token;
}

function findTokenViaIndex(
  index: number,
  tokenGroup: TokenGroup,
) : DSysColorToken | void {
  // find the token in the tokengroup
  const tokenset = tokenGroup.tokensets[0];
  if (!tokenset) return;
  const tokenEntry = Object.entries(tokenset).find(entry => {
    const name = entry[0];
    // thank you design token standard
    const token = entry[1] as DSysToken;
    if (!token || !token.$extensions) return false;
    return token.$extensions['dsys.index'] === index;
  });
  if (!tokenEntry) return;
  const token = tokenEntry[1];// pulling from an entry
  if (!token) return;

  return token;
}