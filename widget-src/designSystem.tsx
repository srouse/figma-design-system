import { TokenSetType } from "../enums";
import {
  defaultDesignSystemModel,
  DesignSystemWidget,
} from "../types";
import {
  establishBase,
  refreshFromBase,
  triggerBaseRefresh
} from "./actions/baseActions";
import { findWidgetTokenset } from "./actions/tokensetActions";
import header from "./header";
import satelliteSwitch from "./satellites/switch";
import {
  findBaseWidget,
  findWidget
} from "./utils";

const { widget } = figma;
const {
  AutoLayout,
  useSyncedState,
  useWidgetId,
  useEffect
} = widget;

export default function designSystem() {
  const nodeId = useWidgetId();

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

  const [isWindowUIOpen, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  const [touch, setTouch] = useSyncedState(
    'touch',
    0
  );

  const widget : DesignSystemWidget = {
    nodeId,
    designSystemModel, setDesignSystemModel,
    touch, setTouch
  };

  useEffect(() => {
    figma.on("close", () => setIsWindowUIOpen(false));

    // if there is no base, we need to find one
    const baseWidget = findBaseWidget();
    if (!baseWidget) {
      // con sole.log(`[useEffect: ${nodeId}] establishBase`);
      establishBase(widget);
    }

    // could be a new widget...
    const thisTokenset = findWidgetTokenset(
      nodeId,
      baseWidget?.widgetSyncedState.designSystemModel
    );
    if (!thisTokenset) {
      // con sole.log(`[useEffect: ${nodeId}] no tokenset, refreshing from base`);
      triggerBaseRefresh();
      return;
    }

    // only the base can update things...
    const thisWidget = findWidget(nodeId);
    if (thisWidget.id !== baseWidget?.id) {
      // con sole.log(`[useEffect: ${nodeId}] not base, stopping`);
      return;
    }

    // only update during an active refresh request
    if (thisWidget.getPluginData('doRefresh') === 'yes') {
      // con sole.log(`[useEffect: ${nodeId}] refreshFromBase`);
      refreshFromBase(widget);
      return;
    }

    // con sole.log(`[useEffect: ${nodeId}] did nothing`);
  });

  const tokenset = findWidgetTokenset(nodeId, designSystemModel);

  let width = 390;
  switch (tokenset?.type) {
    case TokenSetType.TypographySet:
      width = 450;
      break;
  }

  return (
    <AutoLayout 
      name="design-system"
      width={width}
      height="hug-contents"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={14}
      padding={{top: 0,left: 0,bottom: 15,right: 0}}
      effect={isWindowUIOpen ? [{
        "type":"drop-shadow",
        "blur":10,
        "offset":{"x":0,"y":0},
        "blendMode":"normal",
        "color":{"a":0.2,"r":0,"g":0,"b":0},
        "showShadowBehindNode":false
      }] : []}
      stroke="#E0E0E0"
      fill={designSystemModel ? '#ffffff' : '#f2f2f2'}
      cornerRadius={10}>
      {header(tokenset)}
      <AutoLayout 
        name="properties"
        width="fill-parent"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        padding={{top: 10,left: 20,bottom: 0,right: 20}}>
        {satelliteSwitch(tokenset)}
      </AutoLayout>
    </AutoLayout>
  );
}

