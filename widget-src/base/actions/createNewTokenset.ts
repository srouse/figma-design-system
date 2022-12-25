import { sizing } from "../../../shared/styles";
import {
  defaultTokenGroup,
  defaultTokenGroupCategorizedLookup,
} from "../../../shared/types/types";

export default function createNewTokenset(
  nodeId: string,
) {
  const thisWidget = figma.getNodeById(nodeId) as WidgetNode;
  console.log('thisWidget', thisWidget.widgetSyncedState);
  const newSyncedState = {
    ...thisWidget.widgetSyncedState,
    tokenGroupCategorizedLookup:
      defaultTokenGroupCategorizedLookup,
    touch: 0,
    widgetWidth: sizing.defaultWidgetWidth,
    tokenGroup: defaultTokenGroup,
  }
  const newWidget = thisWidget.cloneWidget(newSyncedState);
  thisWidget.parent?.appendChild(newWidget);
  newWidget.x = thisWidget.x;
  newWidget.y = thisWidget.y + thisWidget.height + 40;
}