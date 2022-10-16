import { DSysGroupType, TokenGroup } from "../../shared/index";
import { pullTokensFromColorStyles } from "../satellites/colors/colorStyleUtils";
import { findWidget } from "../utils";
import bounceBack from "../utils/postMessagePromise";

export default async function refreshTokensFromStyles(
  message: any,
  tokenGroup: TokenGroup,
  setTokenGroup: (tokenGroup: TokenGroup) => void,
  nodeId: string,
) {
  if (tokenGroup.type === DSysGroupType.ColorSet) {
    await pullTokensFromColorStyles(
      tokenGroup, setTokenGroup, nodeId
    );
    const thisWidget = findWidget(nodeId);
    bounceBack(message, {
      nodeId,
      globalData: thisWidget.widgetSyncedState.globalData,
      tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
    });
  }
}