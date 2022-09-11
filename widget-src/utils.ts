
export function findAllWidgets(excludeId: string = ''): WidgetNode[] {
  const allWidgetNodes: WidgetNode[] = figma.currentPage.findAll(node => {
    return node.type === 'WIDGET' && node.id !== excludeId;
  }) as WidgetNode[];

  const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter(node => {
    return node.widgetId === figma.widgetId
  });

  return myWidgetNodes;
}

export function findWidget(nodeId: string) {
  const me: WidgetNode = figma.currentPage.findOne(node => {
    return node.id === nodeId
  }) as WidgetNode;
  return me;
}

export function findBaseWidget() {
  const allWidgets = findAllWidgets();
  const baseWidget = allWidgets.find(widget => {
    const widgetModelBaseId = widget.widgetSyncedState.designSystemModel?.baseId;
    if ( widgetModelBaseId && widgetModelBaseId === widget.id ) {
      return widget;
    }
    return false;
  });
  return baseWidget;
}
