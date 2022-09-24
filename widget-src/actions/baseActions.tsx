import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { TokenGroupLookup } from "../../shared/types/types";
import {
  findAllWidgets,
  findBaseWidget,
  findUndeterminedWidget,
  findWidget
} from "../utils";

export async function openEditor(
  nodeId: string,
) {
  // could be a new widget...they don't refresh immediately
  const thisWidget = findWidget(nodeId);

  // open ui via a promise so state stays open
  return new Promise((resolve) => {
    figma.showUI(
      __html__,
      {width: 400, height: 716, themeColors: true}
    );
    figma.ui.postMessage({
      nodeId,
      // designTokensModel: thisWidget.widgetSyncedState.designTokensModel,
      globalData: thisWidget.widgetSyncedState.globalData,
      tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
    });
  });
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
  allWidgets.map(widget => {
    if (widget === baseWidget) return;
    widget.setWidgetSyncedState({
      ...widget.widgetSyncedState,
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
    allOtherWidgets.map(widget => {
      newTokenGroupLookup.push({
        widgetId: widget.id,
        tokenGroupName: widget.widgetSyncedState.tokenGroup?.name,
      });
    });
    baseWidget?.setWidgetSyncedState({
      ...baseWidget.widgetSyncedState,
      tokenGroupLookup: newTokenGroupLookup,
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