import {
  DesignTokensModel,
  TokenSet,
  TokenSetType,
  widgetVersion
} from "../../shared/types/types";
import { findAllWidgets, findBaseWidget, findWidget } from "../utils";
import { findWidgetTokenset } from "./tokensetActions";

export default function normalizeDesignTokensModel(
  designTokensModel: DesignTokensModel
) {
  const newDSysModel = {...designTokensModel};
  // refreshWidgetsVersion(newDSysModel);

  const baseWidget = findBaseWidget();
  if (!baseWidget) return designTokensModel;

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

// DONT DELETE....
// For when versioning becomes an issue...
function refreshWidgetsVersion(
  designTokensModel: DesignTokensModel
) {
  const baseWidget = findBaseWidget();
  if (!baseWidget) return;

  let allWidgets = findAllWidgets();
  allWidgets.map(satelliteWidget => {
    const widgetTokenset = findWidgetTokenset(
      satelliteWidget.id,
      designTokensModel
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
    if (satelliteWidget.id === designTokensModel.baseId) {
      designTokensModel.baseId = newWidget.id;
    }
    satelliteWidget.remove();
  });

  // now update everyone's widget data...
  allWidgets = findAllWidgets();
  allWidgets.map(satelliteWidget => {
    satelliteWidget.setWidgetSyncedState({designTokensModel});
  });
}