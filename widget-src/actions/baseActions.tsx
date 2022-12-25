import { DSysGroupType } from "../../shared/types/designSystemTypes";
import {
  TokenGroup,
  TokenGroupCategorizedLookup,
  TokenGroupLookup
} from "../../shared/types/types";
import {
  findAllWidgets,
  findBaseWidget,
  findUndeterminedWidget,
} from "../utils";

export async function openEditor() {
  // open ui via a promise so state stays open
  return new Promise(() => {
    figma.showUI(
      __html__,
      {
        width: 460,
        height: 664,
        themeColors: true
      }
    );
  }).catch(err => console.error('openEditor error', err));
}

export function triggerBaseRefresh() {
  const baseWidget = findBaseWidget();
  if (baseWidget) {
    baseWidget.setWidgetSyncedState({
      ...baseWidget.widgetSyncedState,
      touch: baseWidget.widgetSyncedState.touch + 1,
    });
  }
}

export function triggerAllWidgetRefresh() {
  const allWidgets = findAllWidgets();
  const baseWidget = findBaseWidget();
  const globalData = baseWidget?.widgetSyncedState.globalData;
  allWidgets.map(widget => {
    if (widget === baseWidget) return;
    widget.setWidgetSyncedState({
      ...widget.widgetSyncedState,
      globalData,
      touch: widget.widgetSyncedState.touch + 1,
    })
  });
  updateBaseWidgetTokenGroupLookup();
}

export function updateBaseWidgetTokenGroupLookup() {
  const baseWidget = findBaseWidget();
  if (baseWidget) {
    const newTokenGroupLookup: TokenGroupLookup[] = [];
    const allOtherWidgets = findAllWidgets();

    const newTokenGroupCategorizedLookup : TokenGroupCategorizedLookup = {
      colors: [],
      typography: [],
      effects: [],
      icons: [],
      breakpoints: [],
      custom: [],
      spacing: [],
      components: [],
    }

    allOtherWidgets.map(widget => {
      const widgetTokenGroup = widget.widgetSyncedState.tokenGroup;
      if (widgetTokenGroup) {
        const tokenGroup = widgetTokenGroup as TokenGroup;
        const tokenGroupLookup = {
          nodeId: widget.id,
          tokenGroupName: tokenGroup.name,
          tokenGroupType: tokenGroup.type,
        };
        newTokenGroupLookup.push(tokenGroupLookup);
  
        if (tokenGroup.type == DSysGroupType.ColorSet) {
          newTokenGroupCategorizedLookup.colors.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.TypographySet) {
          newTokenGroupCategorizedLookup.typography.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.EffectSet) {
          newTokenGroupCategorizedLookup.effects.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.IconSet) {
          newTokenGroupCategorizedLookup.icons.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.BreakpointSet) {
          newTokenGroupCategorizedLookup.breakpoints.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.CustomSet) {
          newTokenGroupCategorizedLookup.custom.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.Spacing) {
          newTokenGroupCategorizedLookup.spacing.push(tokenGroupLookup);
        }else if (tokenGroup.type == DSysGroupType.ComponentSet) {
          newTokenGroupCategorizedLookup.components.push(tokenGroupLookup);
        }
      }
    });

    baseWidget?.setWidgetSyncedState({
      ...baseWidget.widgetSyncedState,
      tokenGroupLookup: newTokenGroupLookup,
      tokenGroupCategorizedLookup: newTokenGroupCategorizedLookup,
      touch: baseWidget.widgetSyncedState.touch + 1,
    });
  }
}

export function establishBase() {
  const baseWidget = findBaseWidget();
  if (!baseWidget) {
    const undeterminedWidget = findUndeterminedWidget();
    if (undeterminedWidget) {
      undeterminedWidget.setWidgetSyncedState({
        ...undeterminedWidget.widgetSyncedState,
        tokenGroup: {
          type: DSysGroupType.Base,
          name: undeterminedWidget.widgetSyncedState.tokenGroup.name,
          tokensets: [],
        }
      });
    }else{
      // create a new widget as base...
      const allWidgets = findAllWidgets();
      if (allWidgets.length > 0) {
        const aWidget = allWidgets[0];
        const newBase = aWidget.clone();
        newBase.x = aWidget.x - 400;
        newBase.setWidgetSyncedState({
          ...newBase.widgetSyncedState,
          tokenGroup: {
            type: DSysGroupType.Base,
            name: 'New Base',
            tokensets: [],
          }
        });
      }
    }
  }
}