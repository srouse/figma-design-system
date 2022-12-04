import { getSvg } from "../iconComponentUtils";
import addSvgAsIcon from "./addSvgAsIcon";

export default async function addIcon(
  nodeId: string,
) {
  if (figma.currentPage.selection.length === 0) {
    figma.notify('Select a vector you would like to add');
    return false;
  }
  if (figma.currentPage.selection.length > 1) {
    figma.notify('Select just one icon (a vector)');
    return false;
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
        'regular',
        nodeId,
      );
    }
    return true;
  }
  figma.notify('Select a node that can be transformed into an svg');
  return false;
}

export function createComponent(newIcon: VectorNode | FrameNode | GroupNode) {
  const component = figma.createComponent();
  component.name = `name=${newIcon.name}`;// , style=regular`;
  component.resizeWithoutConstraints(
    newIcon.width,
    newIcon.height
  );
  return component;
}

export async function getSelectionSvg(): 
Promise<{name:string, svg:string | undefined} | false>
{
  if (figma.currentPage.selection.length === 0) {
    figma.notify('Select a vector you would like to add');
    return false;
  }
  if (figma.currentPage.selection.length > 1) {
    figma.notify('Select just one icon (a vector)');
    return false;
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
    figma.currentPage.selection = [];
    const svg = await getSvg(newIcon, errorLog);
    return {
      name: newIcon.name,
      svg
    };
  }
  figma.notify('Select a node that can be transformed into an svg');
  return false;
}