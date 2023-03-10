import { findWidget } from "../../../utils";
import cleanName from "../../../../shared/utils/cleanName";
import { findComponentSet } from "../layout/componentSet";
import { createComponent } from "./addIcon";

export default async function addSvgAsIcon(
  svg: string,
  name: string,
  style: string,
  nodeId: string,
) {
  const thisWidget = findWidget(nodeId);
  const compSet = findComponentSet(thisWidget);
  if (!compSet) {
    return {success: false};
  }
  const finalName = cleanName( name.replace('.svg', '') );
  const svgFrame = figma.createNodeFromSvg(svg);
  svgFrame.name = finalName;
  const component = createComponent(svgFrame);
  component.appendChild(svgFrame);
  compSet.appendChild(component);
  component.name = `name=${finalName}`;// , style=${style}`;
  return {success: true};
}