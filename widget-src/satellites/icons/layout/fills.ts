import { findComponentSet } from "./componentSet";

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
  node: VectorNode
) {
  const fills = JSON.parse(JSON.stringify(node.fills));
  fills[0].color = {
    r: 53/255,
    g: 55/255,
    b: 57/255,
  }
  fills[0].visible = true;
  node.fills = fills;
}