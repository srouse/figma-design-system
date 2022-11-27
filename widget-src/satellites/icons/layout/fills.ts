import { findComponentSet } from "./componentSet";

export const DEFAULT_ICON_COLOR = {
  r: 53/255,
  g: 55/255,
  b: 57/255,
};

export const DEFAULT_ICON_COLOR_HEX = '#353539';

export function normalizeFills(
  thisWidget: WidgetNode,
) {
  const compSet = findComponentSet(thisWidget);
  if (!compSet) return false;
  compSet.children.map((child) => {
    const childComp = child as ComponentNode;
    childComp.children.map((childChild) => {
      const vectorChild = childChild as VectorNode;
      vectorChild.constraints = {// while we are here...
        horizontal: 'SCALE',
        vertical: 'SCALE'
      };
      processFill(vectorChild);
    });
  })
}

export function processFill(
  node: any
) {
  if (node.type === 'VECTOR') {
    if (node.fills && node.fills.length > 0) {
      const fills = JSON.parse(JSON.stringify(node.fills));
      fills[0].color = DEFAULT_ICON_COLOR;
      fills[0].visible = true;
      node.fills = fills;
    }
    if (node.strokes && node.strokes.length > 0) {
      const strokes = JSON.parse(JSON.stringify(node.strokes));
      strokes[0].color = DEFAULT_ICON_COLOR;
      strokes[0].visible = true;
      node.strokes = strokes;
    }
  }else if (node.children) {
    node.children.map((child: any) => {
      processFill(child);
    })
  }
}