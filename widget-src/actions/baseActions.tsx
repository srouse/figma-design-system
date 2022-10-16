import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { TokenGroupLookup } from "../../shared/types/types";
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
        height: 670,
        themeColors: true
      }
    );
  }).catch(err => console.log('openEditor error', err));
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