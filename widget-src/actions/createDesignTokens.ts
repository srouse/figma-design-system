import {
  DSys,
  DSysGroupType,
  DSysLevel,
  DSysSheet,
  DSysSheetGroupNames,
} from "../../shared/types/designSystemTypes";
import {
  DesignTokensResult,
  TokenGroup,
  toKebobCase,
} from "../../shared/index";
import { findAllWidgets, findBaseWidget } from "../utils";

export default async function createDesignTokens()
: Promise<DesignTokensResult | null> {
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
  const errors : string[] = [];

  // now add tokengroups
  allWidgets.map(widget => {
    const widgetTokenGroup = widget.widgetSyncedState.tokenGroup as TokenGroup;
    // widget token groups != token groups...
    // widget token groups are placed within a larger token group with 
    // a generic name "icons", "colors", etc... 
    const tokensetName = toKebobCase(widgetTokenGroup.name);
    // have to break this out for static typing ease...
    switch (widgetTokenGroup.type) {
      case DSysGroupType.BreakpointSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.breakpoints, DSysGroupType.BreakpointSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.ColorSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.colors, DSysGroupType.ColorSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.ComponentSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.components, DSysGroupType.ComponentSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.CustomSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.custom, DSysGroupType.CustomSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.EffectSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.effects, DSysGroupType.EffectSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.IconSet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.icons, DSysGroupType.IconSet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.Spacing:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.spacing, DSysGroupType.Spacing,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
      case DSysGroupType.TypographySet:
        _createGroup(
          dsysSheet,
          DSysSheetGroupNames.typography, DSysGroupType.TypographySet,
          tokensetName, widgetTokenGroup.tokensets[0], errors,
        );
        break;
    }
  })
  return {
    tokens: dsys,
    errors,
  };
}

// throwing typing out the window for shorter, less repeatative code...
function _createGroup(
  dsysSheet: any,// doesn't quite get through typescripting...
  groupName: DSysSheetGroupNames,
  groupType: DSysGroupType,
  tokensetName: string,
  tokenset: any,
  errors: string[],
) {
  if (!dsysSheet[groupName]) {
    dsysSheet[groupName] = {
      $extensions: {
        'dsys.level': DSysLevel.group,
        'dsys.type': groupType,
        'dsys.nodeIds': [],
      },
      $description: `All the ${groupName} tokens`,
    }
  }
  if (
    tokensetName &&
    !dsysSheet[groupName][tokensetName]
  ) {
    dsysSheet[groupName][tokensetName] = tokenset;
  }else{
    errors.push(`Duplicate name found ${tokensetName}`);
  }
}
