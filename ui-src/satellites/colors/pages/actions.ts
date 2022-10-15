import {
  DSysColorToken,
  DSysToken,
  DSysTokenset,
  MessageRequest,
  TokenGroup
} from "../../../../shared";
import postMessagePromise from "../../../utils/postMessagePromise";

export function changeColorAction(
  color: string,
  alpha: number,
  name: string,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (val: TokenGroup) => void
) {
  // find the token in the tokengroup
  if (!tokenGroup || !updateTokenGroup) return;
  const tokenset = tokenGroup.tokensets[0];
  const token = findToken(name, tokenGroup);
  if (!token) return;

  const newToken: DSysColorToken = {
    ...token,
    $value: {
      hex: color,
      alpha: alpha,
    }
  };
  const newTokenSet : DSysTokenset = {
    ...tokenset
  };
  newTokenSet[name] = newToken;
  // now weave back together...
  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet],
  });
}

export function changeOrder(
  movedRowIndex: number,
  newIndex: number,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (val: TokenGroup) => void
) {
  if (!tokenGroup || !updateTokenGroup) return;
  const tokenset = tokenGroup.tokensets[0];
  const token = findTokenViaIndex(movedRowIndex, tokenGroup);
  if (!token) return;

  // typing will not allow an empty DSysTokenSet
  const newTokenSet: {[key:string]: any} = {};
  Object.entries(tokenset).map(entry => {
    const name = entry[0];
    const value = entry[1];
    if (!value.$extensions) {
      newTokenSet[name] = value;
    }else{
      const token = value as DSysToken;
      const rowIndex = token.$extensions['dsys.index'];

      // moving row up
      if (
        movedRowIndex > newIndex && // row is moving to lower index
        newIndex <= rowIndex &&
        movedRowIndex > rowIndex
      ) {
        newTokenSet[name] = {
          ...token,
          ['$extensions'] : {
            ...token.$extensions,
            ['dsys.index']: rowIndex+1
          }
        };

      // moving row down
      }else if (
        movedRowIndex < newIndex && // row is moving to higher index
        newIndex >= rowIndex &&
        movedRowIndex < rowIndex
      ) {
        newTokenSet[name] = {
          ...token,
          ['$extensions'] : {
            ...token.$extensions,
            ['dsys.index']: rowIndex-1
          }
        };

      }else if (rowIndex === movedRowIndex) {
        newTokenSet[name] = {
          ...token,
          ['$extensions'] : {
            ...token.$extensions,
            ['dsys.index']: newIndex
          }
        };

      }else{
        newTokenSet[name] = {
          ...token
        };
      }
    }
  });

  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet as DSysTokenset],
  });
}

export async function deleteColorToken(
  deletedToken: DSysColorToken,
  tokenGroup: TokenGroup,
  updateTokenGroup: (val: TokenGroup) => void
) {
  await postMessagePromise(
    MessageRequest.deleteStyle,
    {
      styleId: deletedToken.$extensions['dsys.styleId'] 
    }
  );
  const tokenset = tokenGroup.tokensets[0];
  const newTokenSet: {[key:string]: any} = {};
  Object.entries(tokenset).map(entry => {
    const name = entry[0];
    const value = entry[1];
    if (
      !value.$extensions || 
      value.$extensions['dsys.styleId'] !== 
      deletedToken.$extensions['dsys.styleId']
    ) {
      newTokenSet[name] = value;
    }
  });

  // let the style refresh reindex things...
  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet as DSysTokenset],
  });
}

export function changeNameAction(
  newName: string,
  name: string,
  tokenGroup?: TokenGroup,
  updateTokenGroup?: (val: TokenGroup) => void
) {
  // find the token in the tokengroup
  if (!tokenGroup || !updateTokenGroup) return;
  const tokenset = tokenGroup.tokensets[0];
  const token = findToken(name, tokenGroup);
  if (!token) return;

  const newToken: DSysColorToken = {
    ...token,
    $extensions: {
      ...token.$extensions,
      "dsys.name": newName,
    }
  };
  const newTokenSet : DSysTokenset = {
    ...tokenset
  };
  newTokenSet[newName] = newToken;
  delete newTokenSet[name];

  // now weave back together...
  updateTokenGroup({
    ...tokenGroup,
    tokensets: [newTokenSet],
  });
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