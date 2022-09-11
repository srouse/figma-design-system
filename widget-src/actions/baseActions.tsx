import {
  DesignSystemWidget
} from "../../shared/types";
import {
  findAllWidgets,
  findBaseWidget,
  findWidget
} from "../utils";
import normalizeDesignSystemModel from "./baseNormalization";
import { findWidgetTokenset } from "./tokensetActions";


export async function openEditor(
  nodeId: string,
) {

  // could be a new widget...they don't refresh immediately
  const thisWidget = findWidget(nodeId);
  const thisTokenset = findWidgetTokenset(
    nodeId,
    thisWidget.widgetSyncedState.designSystemModel
  );

  if (!thisTokenset) {
    triggerBaseRefresh();
    // tick for things to update
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  }

  // setHasOpenWindowUI(true);

  // open ui via a promise so state stays open
  return new Promise((resolve) => {
    figma.showUI(
      __html__,
      {width: 400, height: 500, themeColors: true}
    );
    figma.ui.postMessage({
      nodeId,
      designSystemModel: thisWidget.widgetSyncedState.designSystemModel
    });
  });
}

export function triggerBaseRefresh() {
  let baseWidget = findBaseWidget();
  if (!baseWidget) return;
  // plugin data doesn't trigger a refresh, so this tells 
  // base to go ahead and redo everything
  baseWidget.setPluginData('doRefresh', 'yes');

  // take this time to make the design system model coherent
  // relative to widgets
  const normalDSysModel = normalizeDesignSystemModel(
    baseWidget.widgetSyncedState.designSystemModel
  );
  baseWidget = findBaseWidget();
  if (!baseWidget) return;
  baseWidget.setPluginData('doRefresh', 'yes');

  // touch state to trigger refresh
  baseWidget.setWidgetSyncedState({
    ...baseWidget.widgetSyncedState,
    designSystemModel: normalDSysModel,
    touch: baseWidget.widgetSyncedState.touch + 1
  });
}

export function establishBase(
  widget: DesignSystemWidget
) {
  const baseWidget = findBaseWidget();
  if (!baseWidget) {
    const thisWidget = findWidget(widget.nodeId);
    const newBaseWidget = thisWidget.cloneWidget({});
    widget.setDesignSystemModel({
      ...widget.designSystemModel,
      baseId: newBaseWidget.id
    });
    /*
    widget.setDesignSystemModel({
      ...widget.designSystemModel,
      baseId: widget.nodeId
    });
    */
  }
}

export function refreshFromBase(
  widget: DesignSystemWidget
) {
  let baseWidget = findBaseWidget();
  if (!baseWidget) return;
  
  const allWidgets = findAllWidgets();
  if (baseWidget.id !== widget.nodeId ) {
    triggerBaseRefresh();
    return;// stop and tell base to go
  }

  // walk through all satellites and update their model
  const baseDSysModel = baseWidget.widgetSyncedState.designSystemModel;
  allWidgets.map(satelliteWidget => {
    // don't want to operate on base widget
    if (satelliteWidget === baseWidget) {
      return;
    }

    // update all satellites to base design system model
    satelliteWidget.setWidgetSyncedState({
      ...satelliteWidget.widgetSyncedState,
      designSystemModel: {...baseDSysModel},
      touch: satelliteWidget.widgetSyncedState.touch + 1
    });
  });

  baseWidget = findBaseWidget();
  if (!baseWidget) return;
  baseWidget.setPluginData('doRefresh', 'no');

  /*
  con sole.log(
    `[refreshFromBase: ${widget.nodeId}] Base DesignSystemModel`,
    baseWidget.widgetSyncedState.designSystemModel
  );
  */
}
