import { findWidget } from "../../../utils";
import { findComponentSet } from "../layout/componentSet";
import { processFill } from "../layout/fills";

export default function addIcon(
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
  console.log(newIcon.type);
  if (
    newIcon.type === 'VECTOR' ||
    newIcon.type === 'RECTANGLE' ||
    newIcon.type === 'ELLIPSE'
  ) {
    const component = createComponent(newIcon as VectorNode);
    component.appendChild(newIcon);
    processFill(newIcon as VectorNode);
    const compSet = findComponentSet(thisWidget);
    if (compSet) compSet.appendChild(component);
  }

  if (newIcon.type === 'FRAME') {
    const component = createComponent(newIcon);
    if (newIcon.children.length !== 1 ) {
      figma.notify('Select a vector or a frame with a single vector child');
      return;
    }
    const child = newIcon.children[0];
    component.appendChild(child);
    processFill(child as VectorNode);
    newIcon.remove();// not needed anymore
    const compSet = findComponentSet(thisWidget);
    if (compSet) compSet.appendChild(component);
  }

  if (newIcon.type === 'GROUP') {
    const component = createComponent(newIcon);
    if (newIcon.children.length !== 1 ) {
      figma.notify('Select a vector or a group with a single vector child');
      return;
    }
    const child = newIcon.children[0];
    const initX = newIcon.x;
    const initY = newIcon.y;
    component.appendChild(child);
    child.x = child.x - initX;
    child.y = child.y - initY;
    processFill(child as VectorNode);
    const compSet = findComponentSet(thisWidget);
    if (compSet) compSet.appendChild(component);
  }
}

function createComponent(newIcon: VectorNode | FrameNode | GroupNode) {
  const component = figma.createComponent();
  component.name = `name=${newIcon.name}, style=regular`;
  component.resizeWithoutConstraints(
    newIcon.width,
    newIcon.height
  );
  return component;
}

