import { findComponentSet } from "./componentSet";
import { findParentGroup } from "./grouping";
import { sizing } from "../../../../shared/styles";

// TODO: factor in size spread
export function resizeComponentSet(
  thisWidget: WidgetNode,
) {
  const groupParent = findParentGroup(thisWidget);
  const compSet = findComponentSet(thisWidget);
  if (!compSet || !groupParent) return false;
  
  // tokens are derived from component, so feed off of what's there...
  const totalIcons = compSet.children.length;

  const iconsPerRow = Math.max(
    sizing.minIconsCols,
    Math.ceil( totalIcons / sizing.maxIconsRows )
  );

  // Component Set Width
  const totalWidthPadding = sizing.iconCompsetPadding*2;
  const compWidth = Math.max(
    sizing.defaultWidgetWidth - totalWidthPadding,
    ( 
      iconsPerRow *
      (sizing.iconDisplaySize + (sizing.iconHorizontalSpacing))
    ) + 
    totalWidthPadding
    - sizing.iconHorizontalSpacing // there is one too many 
  );

  // Component Set Height
  const totalRows = Math.ceil( totalIcons / iconsPerRow );

  const compHeight = totalRows * (
    sizing.iconDisplaySize + 
    (sizing.iconVerticalSpacing)
  ) + sizing.iconCompsetPadding;

  compSet.resize(
    compWidth,
    compHeight,
  );
  compSet.x = thisWidget.x + sizing.iconCompsetPadding;
  compSet.y = thisWidget.y + sizing.headerHeight + sizing.iconCompsetPadding;

  compSet.children.map((child, index) => {
    const childComp = child as ComponentNode;
    resizeIconCompChildren(childComp);

    const col = index % iconsPerRow;
    childComp.x = sizing.iconCompsetPadding + (
      (sizing.iconDisplaySize + sizing.iconHorizontalSpacing) * col
    );

    const row = Math.floor( index / iconsPerRow );
    childComp.y = sizing.iconCompsetPadding + (
      (sizing.iconDisplaySize + sizing.iconVerticalSpacing) * row
    );
  });

  return {
    width: compWidth,
    height: compHeight,
  }
}

/* export function setIconPadding(
  thisWidget: WidgetNode,
  padding: number
) {
  const compSet = findComponentSet(thisWidget);
  if (!compSet) return false;
  compSet.children.map((child) => {
    const childComp = child as ComponentNode;
    childComp.children.map(childChild => {
      const vector = (childChild as VectorNode);
      const largestSize = (vector.width > vector.height) ? 
        vector.width : vector.height;
      const newMaxSize = sizing.iconDisplaySize - (padding*2)
      const percentDiff =  newMaxSize/largestSize;
      vector.resize(
        vector.width * percentDiff,
        vector.height * percentDiff
      );
      vector.x = sizing.iconDisplaySize/2 - vector.width/2;
      vector.y = sizing.iconDisplaySize/2 - vector.height/2;
    });
  });
}*/

export function resizeIconCompChildren(
  comp: ComponentNode
) {
  /*
  if (
    comp.width !== sizing.iconDisplaySize ||
    comp.height !== sizing.iconDisplaySize || true
  ) {
  */

    // adding a little whitespace around icon
    const scale = comp.getPluginData('scale') ?
      parseFloat(comp.getPluginData('scale')) : 0.1;
    const offsetX = comp.getPluginData('offsetX') ?
      parseFloat(comp.getPluginData('offsetX')) : 0.0;
    let offsetY = parseFloat(comp.getPluginData('offsetY'));
    offsetY = offsetY || 0.0;

    const targetSize = sizing.iconDisplaySize -
      (sizing.iconDisplaySize * scale);

    // find largest dimension and it's size difference...
    let maxDimension = 0;
    comp.children.map(compChild => {
      maxDimension = Math.max(
        compChild.width, maxDimension,
      );
      maxDimension = Math.max(
        compChild.height, maxDimension,
      );
    });
    const diff = targetSize - maxDimension;
    const percentDiff = 1 + diff / maxDimension;

    comp.children.map(compChild => {
      const compChildVector = (compChild as VectorNode);
      compChildVector.resize(
        compChild.width * percentDiff,
        compChild.height * percentDiff
      );
      // so it doesnt distort during resize
      compChildVector.constraints = {
        horizontal: 'MIN',
        vertical: 'MIN',
      };
      // center them
      const offsetXPixels = offsetX * sizing.iconDisplaySize;
      compChildVector.x =
        sizing.iconDisplaySize/2 - compChildVector.width/2 + offsetXPixels;
      const offsetYPixels = offsetY * sizing.iconDisplaySize;
      compChildVector.y =
        sizing.iconDisplaySize/2 - compChildVector.height/2 + offsetYPixels;
    });

    comp.resize(
      sizing.iconDisplaySize,
      sizing.iconDisplaySize
    );
  
    // gotta reset to stretch unforch
    comp.children.map(compChild => {
      const compChildVector = (compChild as VectorNode);
      compChildVector.constraints = {
        horizontal: 'STRETCH',
        vertical: 'STRETCH',
      };
    });
  // }
}
