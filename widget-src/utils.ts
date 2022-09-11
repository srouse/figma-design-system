import { TokenSet, TokenSetCategory } from "../shared/types";

figma.skipInvisibleInstanceChildren = true;

export function findAllWidgets(excludeId: string = ''): WidgetNode[] {
  const widgetNodes = _findAllWidgets();

  const myWidgetNodes: WidgetNode[] = widgetNodes.filter(node => {
    return node.widgetId === figma.widgetId
  });

  return myWidgetNodes;
}

export function findWidget(nodeId: string) {
  const widgetNodes = _findAllWidgets();

  const widget: WidgetNode = widgetNodes.find(node => {
    return node.id === nodeId;
  }) as WidgetNode;

  return widget;
}

export function findBaseWidget() {
  const allWidgets = _findAllWidgets();
  const baseWidget = allWidgets.find(widget => {
    const widgetModelBaseId = widget.widgetSyncedState.designSystemModel?.baseId;
    if ( widgetModelBaseId && widgetModelBaseId === widget.id ) {
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

export function sortIntoCategories(
  tokensets: TokenSet[]
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