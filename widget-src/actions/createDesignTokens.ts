import { DSys, DSysColorTokenset, DSysGroupType, DSysLevel, DSysSheet, DSysTokenset } from "../../shared/types/designSystemTypes";
import { TokenGroup } from "../../shared/types/types";
import { findAllWidgets, findBaseWidget } from "../utils";


export default async function createDesignTokens() : Promise<DSys | null> {
  const allWidgets = findAllWidgets();
  const baseWidget = findBaseWidget();
  if (!baseWidget) return null;

  const globaData = baseWidget.widgetSyncedState.globalData;
  const baseTokenGroup = baseWidget.widgetSyncedState.tokenGroup;

  const dsys: DSys = {
    $description: `${globaData.fullName} (${globaData.prefix}) Design Tokens`
  };
  const dsysSheet : DSysSheet = {
    $extensions: {
      'dsys.level': DSysLevel.sheet,
      'dsys.prefix' : globaData.prefix,
      'dsys.fullName': globaData.fullName,
      'dsys.baseId': baseTokenGroup.nodeId,
    }
  };
  dsys[globaData.prefix] = dsysSheet;

  // now add tokengroups
  allWidgets.map(widget => {
    const tokenGroup = widget.widgetSyncedState.tokenGroup as TokenGroup;
    if (tokenGroup.type === DSysGroupType.ColorSet) {
      if (!dsysSheet['colors']) {
        dsysSheet['colors'] = {
          $extensions: {
            'dsys.level': DSysLevel.group,
            'dsys.type': DSysGroupType.ColorSet,
            'dsys.nodeIds': [],
          },
          $description: 'All the colors in this design system',
        }
      }
      if (tokenGroup.name) {
        dsysSheet['colors'][tokenGroup.name] = 
          tokenGroup.tokensets[0] as DSysColorTokenset;
      }
    }
  })
  return dsys;
}
