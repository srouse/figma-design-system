import { findComponentSet } from "./componentSet";

// GROUP
export function findParentGroup(
  thisWidget: WidgetNode,
) {
  if (
    !thisWidget.parent ||
    !(thisWidget.parent.type === "GROUP")
  ) {
    return false;
  }
  return thisWidget.parent;
}

export function groupWidget(
  thisWidget: WidgetNode,
) {
  if (findParentGroup(thisWidget)) return;
  if (thisWidget.parent) {
    const group = figma.group([thisWidget], thisWidget.parent);
    group.name = thisWidget.name;
  }else{
    console.error('no widget parent');
  }
}

export function ejectOtherNodes(
  thisWidget: WidgetNode,
) {
  const parentGroup = findParentGroup(thisWidget);
  const iconCompSet = findComponentSet(thisWidget);
  if (!parentGroup || !iconCompSet) return;

  const groupParent = parentGroup.parent;
  parentGroup.children.map(child => {
    if (
      child !== thisWidget &&
      child !== iconCompSet
    ) {
      console.log("ejecting", child);
      // eject
      if (groupParent) {
        groupParent.appendChild(child);
        child.y = thisWidget.y - child.height - 10;
      }else{
        child.remove();
      }
    }
  });
}