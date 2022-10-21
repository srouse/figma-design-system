import { TokenGroup } from "../../shared/index";
import { findWidget } from "../utils";
import { updateBaseWidgetTokenGroupLookup } from "./baseActions";

export default function updateTokenGroup(
  nodeId: string,
  tokenGroup: TokenGroup,
  setTokenGroup: (tokenGroup: TokenGroup) => void
) {
  // update base's token group lookup for index display...
  // tell the base something changed
  let doUpdate = false;
  const thisWidget = findWidget(nodeId);
  const widgetTokenGroup = thisWidget.widgetSyncedState.tokenGroup;
  if (
    widgetTokenGroup && 
    widgetTokenGroup.name !== tokenGroup.name
  ) {
    doUpdate = true;
  }
  setTokenGroup({
    ...tokenGroup,
  });
  if (doUpdate) updateBaseWidgetTokenGroupLookup();
}