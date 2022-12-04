import { findWidget } from "../../../utils";
import { findComponentSet } from "../layout/componentSet";


export default function changeIconCompName(
  nodeId: string,
  name: string,
) {
  const thisWidget = findWidget(nodeId);
  const compSet = findComponentSet(thisWidget);
  if (compSet) compSet.name = name;
  // the refresh cycle uses this name as a basis for the tokenset
}