import { findWidget } from "../../../utils";
import { getSvg } from "../iconComponentUtils";
import { findComponentSet } from "../layout/componentSet";
import { processFill } from "../layout/fills";
import addSvgAsIcon from "./addSvgAsIcon";

export default async function addIcon(
  nodeId: string,
) {
  const thisWidget = findWidget(nodeId);
  console.log(
    figma.currentPage.selection.length
  )
  if (figma.currentPage.selection.length === 0) {
    figma.notify('Select a vector you would like to add');
    return;
  }
  if (figma.currentPage.selection.length > 1) {
    figma.notify('Select just one icon (a vector)');
    return;
  }

  const newIcon = figma.currentPage.selection[0];

  if (
    newIcon.type === 'VECTOR' ||
    newIcon.type === 'RECTANGLE' ||
    newIcon.type === 'ELLIPSE' ||
    newIcon.type === 'COMPONENT' ||
    newIcon.type === 'FRAME' ||
    newIcon.type === 'GROUP' ||
    newIcon.type === 'INSTANCE' ||
    newIcon.type === 'POLYGON' ||
    newIcon.type === 'STAR'
    // newIcon.type === 'WIDGET'
  ) {
    const errorLog: string[] = [];
    const svg = await getSvg(newIcon, errorLog);
    if (svg) {
      await addSvgAsIcon(
        svg,
        newIcon.name,
        nodeId,
      );
    }
    return true;
  }
  figma.notify('Select a node that can be transformed into an svg');
}

export function createComponent(newIcon: VectorNode | FrameNode | GroupNode) {
  const component = figma.createComponent();
  component.name = `name=${newIcon.name}, style=regular`;
  component.resizeWithoutConstraints(
    newIcon.width,
    newIcon.height
  );
  return component;
}

