import { DSysGroupType } from "../shared/types/designSystemTypes";

figma.skipInvisibleInstanceChildren = true;

export function findAllWidgets(
  excludeId: string = ''
): WidgetNode[] {
  let widgetNodes = _findAllWidgets();

  if (excludeId) {
    widgetNodes = widgetNodes.filter(node => {
      return node.id !== excludeId;
    });
  }

  return widgetNodes;
}

export function findWidget(nodeId: string) {
  const widgetNodes = _findAllWidgets();

  const widget: WidgetNode = widgetNodes.find(node => {
    return node.id === nodeId;
  }) as WidgetNode;

  return widget;
}

export function findBaseWidget() {
  return findFirstWidgetOfType(DSysGroupType.Base);
}

export function findUndeterminedWidget() {
  return findFirstWidgetOfType(DSysGroupType.Undetermined);
}

export function findFirstWidgetOfType(type: DSysGroupType) {
  const allWidgets = _findAllWidgets();
  const baseWidget = allWidgets.find(widget => {
    const tokenGroup = widget.widgetSyncedState.tokenGroup;
    if (tokenGroup?.type === type) {
      return widget;
    }
    return false;
  });
  return baseWidget;
}

function _findAllWidgets() {
  // need them from anywhere within the document...
  let widgetNodes: WidgetNode[] = [];
  figma.root.children.map((page: PageNode) => {
    const pageWidgetNodes = page.findAllWithCriteria({
      types: ['WIDGET']
    });
    widgetNodes = [
      ...widgetNodes,
      ...pageWidgetNodes
    ]
  });
  // now take only those that are design token widgets
  widgetNodes = widgetNodes.filter(node => {
    return node.widgetId === figma.widgetId;
  });
  return widgetNodes;
}

export function findNodeParentPage(node: BaseNode) {
  let parent: (BaseNode & ChildrenMixin) | null | undefined = node.parent;
  while (
    parent &&
    parent?.type !== "PAGE"
  ) {
    parent = parent?.parent;
  }
  return parent;
}

/*
export function sortIntoCategories(
  widgets: WidgetNode,
) : TokenSetCategory[] {
  const categorizedTokensets: TokenSetCategory[] = [];
  const createdCategories: {[key:string]: TokenSetCategory} = {};
  
  tokensets.map((tokenset: TokenSet) => {
    if (!createdCategories[tokenset.type]) {
      const category: TokenSetCategory = {
        type: tokenset.type,
        tokensets: []
      }
      createdCategories[tokenset.type] = category;
      categorizedTokensets.push(category);
    }
    createdCategories[tokenset.type].tokensets.push(tokenset);
  });
  categorizedTokensets.sort((
    a: TokenSetCategory, b: TokenSetCategory
  ) => {
    const x = a.type.toLowerCase();
    const y = b.type.toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  });
  return categorizedTokensets;
}
*/