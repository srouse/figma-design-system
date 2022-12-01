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

  const minIconsCols = 5;
  const maxIconsRows = 6;
  const iconsPerRow = Math.max(
    minIconsCols,
    Math.ceil( totalIcons / maxIconsRows )
  );

  // Component Set Width
  const compWidth = Math.max(
    sizing.defaultWidgetWidth,
    ( iconsPerRow * (sizing.iconDisplaySize + (sizing.iconHorizontalSpacing))) + 
    sizing.iconCompsetPadding
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
    formatVectorsIntoComponent(childComp);

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

export function setIconPadding(
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
}

function formatVectorsIntoComponent(
  comp: ComponentNode
) {
  if (
    comp.width !== sizing.iconDisplaySize ||
    comp.height !== sizing.iconDisplaySize
  ) {
    // we know that the component is probably new (or has been messed with)
    // so a component could be different proportion...
    const largestSize = (comp.width > comp.height) ? 
      comp.width : comp.height;
    // adding a little whitespace around icon
    const percentDiff = (sizing.iconDisplaySize-8) / largestSize;
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
      compChildVector.x = sizing.iconDisplaySize/2 - compChildVector.width/2;
      compChildVector.y = sizing.iconDisplaySize/2 - compChildVector.height/2;
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
  }
}