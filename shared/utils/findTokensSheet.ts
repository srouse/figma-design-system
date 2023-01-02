import {
  DSys,
  DSysSheet,
} from '../types/designSystemTypes';

export default function findTokensSheet(
  dsys: DSys | undefined,
) : DSysSheet | undefined {
  if (!dsys) return undefined;
  // so there is only one tokenSheet in a tokens file...
  let tokenSheet: DSysSheet | undefined;
  Object.entries(dsys).find(entry => {
    const name = entry[0] as string;
    if (name.indexOf('$') !== 0) {
      tokenSheet = entry[1] as DSysSheet;
      return true;
    }
    return false;
  });

  return tokenSheet;
}
