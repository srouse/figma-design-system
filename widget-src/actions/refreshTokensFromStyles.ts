import { DSysGroupType, TokenGroup } from "../../shared/index";
import { pullTokensFromColorStyles } from "../satellites/colors/colorStyleUtils";
import { pullTokensFromEffectStyles } from "../satellites/effects/effectsUtils";
import { pullTokensFromTextStyles } from "../satellites/typography/typographyUtils";
import { findWidget } from "../utils";
import bounceBack from "../utils/postMessagePromise";

export default function refreshTokensFromStyles(
  message: any,
  tokenGroup: TokenGroup,
  setTokenGroup: (tokenGroup: TokenGroup) => void,
  nodeId: string,
) {
  if (tokenGroup.type === DSysGroupType.ColorSet) {
    pullTokensFromColorStyles(
      tokenGroup, setTokenGroup, nodeId
    );
  }else if (tokenGroup.type === DSysGroupType.TypographySet) {
    pullTokensFromTextStyles(
      tokenGroup, setTokenGroup, nodeId
    );
  }else if (tokenGroup.type === DSysGroupType.EffectSet) {
    pullTokensFromEffectStyles(
      tokenGroup, setTokenGroup, nodeId
    );
  }
  const thisWidget = findWidget(nodeId);
  bounceBack(message, {
    nodeId,
    globalData: thisWidget.widgetSyncedState.globalData,
    tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
  });
}