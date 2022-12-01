import { sizing } from "../../../../shared/styles";
import { findWidget } from "../../../utils";
import { findComponentSet } from "./componentSet";
import { nameToProps } from "./naming";

export type LabelMetric = {
  name: string,
  x: number,
  y: number,
};

export default function computeLabelMetrics(
  nodeId: string,
) {
  const thisWidget = findWidget(nodeId);
  const compSet = findComponentSet(thisWidget);

  const metrics: LabelMetric[] = [];
  if (compSet) {
    compSet.children.map(child => {
      const nameObj = nameToProps(child.name);
      metrics.push({
        name: nameObj.name,
        x: child.x + sizing.iconCompsetPadding,
        y: child.y + child.height + sizing.iconCompsetPadding,
      });
    })
  }

  return metrics;
}