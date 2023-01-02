import {
  DSys,
  DSysGroup,
  DSysSheetGroupNames,
} from '../types/designSystemTypes';
import findTokensSheet from './findTokensSheet';

export default function findTokenGroup(
  dsys: DSys | undefined,
  groupName: DSysSheetGroupNames,
) : DSysGroup<unknown, unknown> | undefined {
  if (!dsys) return undefined;
  // so there is only one tokenSheet in a tokens file...
  let tokenSheet = findTokensSheet(dsys);

  if (!tokenSheet) return undefined;

  let tokenGroup: DSysGroup<unknown, unknown> | undefined;
  Object.entries(tokenSheet).find(entry => {
    const name = entry[0] as string;
    if ( name === groupName ) {
      tokenGroup = entry[1] as DSysGroup<unknown, unknown>;
      return true;
    }
    return false;
  });

  return tokenGroup;
}
