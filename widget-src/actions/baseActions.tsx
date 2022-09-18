import { DSysGroupType } from "../../shared/types/designSystemTypes";
import {
  DesignSystemWidget, TokenSet
} from "../../shared/types/types";
import {
  findAllWidgets,
  findBaseWidget,
  findUndeterminedWidget,
  findWidget
} from "../utils";
import normalizeDesignTokensModel from "./baseNormalization";
import { findWidgetTokenset } from "./tokensetActions";


export async function openEditor(
  nodeId: string,
) {

  // could be a new widget...they don't refresh immediately
  const thisWidget = findWidget(nodeId);
  const thisTokenset = findWidgetTokenset(
    nodeId,
    thisWidget.widgetSyncedState.designTokensModel
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

  // open ui via a promise so state stays open
  return new Promise((resolve) => {
    figma.showUI(
      __html__,
      {width: 400, height: 716, themeColors: true}
    );
    figma.ui.postMessage({
      nodeId,
      designTokensModel: thisWidget.widgetSyncedState.designTokensModel
    });
  });
}

export function triggerBaseRefresh(
  tokensetTrigger?: TokenSet
) {
  let baseWidget = findBaseWidget();
  if (!baseWidget) return;
  // plugin data doesn't trigger a refresh, so this tells 
  // base to go ahead and redo everything
  baseWidget.setPluginData(
    'doRefresh',
    tokensetTrigger ? tokensetTrigger.nodeId : 'yes'
  );

  // take this time to make the design system model coherent
  // relative to widgets
  const normalDSysModel = normalizeDesignTokensModel(
    baseWidget.widgetSyncedState.designTokensModel
  );
  baseWidget = findBaseWidget();
  if (!baseWidget) return;
  baseWidget.setPluginData(
    'doRefresh',
    tokensetTrigger ? tokensetTrigger.nodeId : 'yes'
  );

  // touch state to trigger refresh
  baseWidget.setWidgetSyncedState({
    ...baseWidget.widgetSyncedState,
    designTokensModel: normalDSysModel,
    touch: baseWidget.widgetSyncedState.touch + 1
  });
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

    /* !!!!KEEP!!! not working smoothly enough...
    const thisWidget = findWidget(widget.nodeId);
    const newBaseWidget = thisWidget.cloneWidget({});
    widget.setDesignTokensModel({
      ...widget.designTokensModel,
      baseId: newBaseWidget.id
    });
    */
    
    /*
    widget.setDesignTokensModel({
      ...widget.designTokensModel,
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
  const baseDSysModel = baseWidget.widgetSyncedState.designTokensModel;
  let totalProcess = 0;
  const refreshNodeId = baseWidget.getPluginData('doRefresh');
  allWidgets.map(satelliteWidget => {
    // don't want to operate on base widget
    if (satelliteWidget === baseWidget) {
      return;
    }

    if (refreshNodeId !== 'yes') {
      if (satelliteWidget.id !== refreshNodeId) {
        return;
      }
    }

    // update all satellites to base design system model
    totalProcess++;
    satelliteWidget.setWidgetSyncedState({
      ...satelliteWidget.widgetSyncedState,
      designTokensModel: {...baseDSysModel},
      touch: satelliteWidget.widgetSyncedState.touch + 1
    });
  });

  // cons ole.log(`[refreshFromBase: ${widget.nodeId}] 
  //    refreshed ${totalProcess} widgets`);

  baseWidget = findBaseWidget();
  if (!baseWidget) return;
  baseWidget.setPluginData('doRefresh', 'no');

  /*
  con sole.log(
    `[refreshFromBase: ${widget.nodeId}] Base DesignTokensModel`,
    baseWidget.widgetSyncedState.designTokensModel
  );
  */
}
