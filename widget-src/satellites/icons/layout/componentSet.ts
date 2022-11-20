import defaultSvg from "./defaultSvg";
import { processFill } from "./fills";
import { findParentGroup } from "./grouping";

// COMPONENT SET
export function findComponentSet(
  thisWidget: WidgetNode,
) {
  const groupParent = findParentGroup(thisWidget);
  if (!groupParent) return undefined;

  const compSets = groupParent.findAllWithCriteria({
    types: ['COMPONENT_SET']
  });

  if (
    compSets.length !== 1
  ) {
    return undefined;
  }
  return compSets[0];
}

export function createComponentSet(
  thisWidget: WidgetNode,
) {
  const groupParent = findParentGroup(thisWidget);
  const compSet = findComponentSet(thisWidget);
  // don't do anything if there is a compSet
  if (compSet || !groupParent) return undefined;

  // create an example...
  const component = figma.createComponent();
  component.name = 'name=default, style=regular';
  const defaultSVGNode = figma.createNodeFromSvg(defaultSvg);
  component.resizeWithoutConstraints(
    defaultSVGNode.width,
    defaultSVGNode.height
  );
  for (const child of defaultSVGNode.children) {
    component.appendChild(child);
    processFill(child as VectorNode);
  }

  if (groupParent) {
    groupParent.appendChild( component );
    const compSet = figma.combineAsVariants([component], groupParent );
    // doesn't come with a stroke color it seems
    const strokes = [{
      type: 'SOLID',
      color: {
        r: 151/255,
        g: 71/255,
        b: 255/255,
      }
    }];
    compSet.strokes = strokes as readonly Paint[];
  }
}

