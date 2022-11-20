import { TokenGroup } from "../../../../shared/index";
import { sizing } from "../../../../shared/styles";
import { findWidget } from "../../../utils";
import { createComponentSet } from "./componentSet";
import { normalizeFills } from "./fills";
import { ejectOtherNodes, groupWidget } from "./grouping";
import { normalizeIconComponentNames } from "./naming";
import { resizeComponentSet, setIconPadding } from "./sizing";

export default function refreshLayout(
  nodeId: string,
  tokenGroup: TokenGroup,
  setCompSetHeight: (compSetMetrics: number) => void,
  setWidgetWidth: (compSetMetrics: number) => void
) {
  const thisWidget = findWidget(nodeId);

  // make sure all/only the elements exist
  groupWidget(thisWidget);
  createComponentSet(thisWidget);
  ejectOtherNodes(thisWidget);

  // normalize
  normalizeFills(thisWidget);
  normalizeIconComponentNames(thisWidget, tokenGroup);

  // size accordingly
  const compSetMetrics = resizeComponentSet(thisWidget);
  if (compSetMetrics) {
    setCompSetHeight(compSetMetrics.height);
    setWidgetWidth(compSetMetrics.width + (sizing.iconSpacing*2));
  }

  // testing
  // setIconPadding(thisWidget, 10);
}

