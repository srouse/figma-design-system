import { TokenSetType } from "../../shared/enums";
import { DesignSystemModel, TokenSet, widgetVersion } from "../../shared/types";
import { findAllWidgets, findBaseWidget, findWidget } from "../utils";
import { findWidgetTokenset } from "./tokensetActions";

export default function normalizeDesignSystemModel(
  designSystemModel: DesignSystemModel
) {
  const newDSysModel = {...designSystemModel};
  // refreshWidgetsVersion(newDSysModel);

  const baseWidget = findBaseWidget();
  if (!baseWidget) return designSystemModel;

  const allWidgets = findAllWidgets();

  allWidgets.map(satelliteWidget => {
    // normalize tokensets to satellite
    const tokenset = findWidgetTokenset(satelliteWidget.id, newDSysModel);
    if (!tokenset) {
      // no tokenset, so add one.
      if (!newDSysModel.tokensets) newDSysModel.tokensets = [];
      newDSysModel.tokensets.push({
        type: (baseWidget === satelliteWidget) ?
          TokenSetType.Base : TokenSetType.Undetermined,
        nodeId: satelliteWidget.id,
        sortIndex: newDSysModel.tokensets.length
      })
    }
  });

  const newTokensets : TokenSet[] = [];
  newDSysModel.tokensets.map(tokenset => {
    const widget = findWidget(tokenset.nodeId);
    // make sure base is right type
    if (baseWidget.id === tokenset.nodeId) {
      tokenset.type = TokenSetType.Base;
    }
    if (widget) {
      newTokensets.push(tokenset);
    }
  });
  newDSysModel.tokensets = newTokensets;

  return newDSysModel;
}

// For when versioning becomes an issue...
function refreshWidgetsVersion(
  designSystemModel: DesignSystemModel
) {
  const baseWidget = findBaseWidget();
  if (!baseWidget) return;

  let allWidgets = findAllWidgets();
  allWidgets.map(satelliteWidget => {
    const widgetTokenset = findWidgetTokenset(
      satelliteWidget.id,
      designSystemModel
    );
    if (!widgetTokenset) return;
    const newWidget = satelliteWidget.cloneWidget({});
      // satelliteWidget.widgetSyncedState,
      // satelliteWidget.widgetSyncedState
    // );
    satelliteWidget.parent?.appendChild(newWidget);
    newWidget.x = satelliteWidget.x;
    newWidget.y = satelliteWidget.y;
    widgetTokenset.nodeId = newWidget.id;
    if (satelliteWidget.id === designSystemModel.baseId) {
      designSystemModel.baseId = newWidget.id;
    }
    satelliteWidget.remove();
  });

  // now update everyone's widget data...
  allWidgets = findAllWidgets();
  allWidgets.map(satelliteWidget => {
    satelliteWidget.setWidgetSyncedState({designSystemModel});
  });
}