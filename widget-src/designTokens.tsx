import {
  defaultGlobalData,
  defaultTokenGroupLookup,
} from "../shared/types/types";
import {
  establishBase,
} from "./actions/baseActions";
import header from "./components/header";
import satelliteSwitch from "./satellites/switch";
import {
  findBaseWidget,
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

  const [isWindowUIOpen, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  const [globalData, setGlobalData] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const [tokenGroupLookup, setTokenGroupLookup] = useSyncedState(
    'tokenGroupLookup',
    defaultTokenGroupLookup
  );

  const [initialized, setInitialized] = useSyncedState(
    'initialized',
    false
  );

  useEffect(() => {
    figma.on("close",() => setIsWindowUIOpen(false));

    // if there is no base, we need to find one
    const baseWidget = findBaseWidget();
    if (!baseWidget) {
      console.log(`[useEffect: ${nodeId}] establishBase`);
      establishBase();
    }

    if (!initialized) {
      console.log('new widget', nodeId);
      setInitialized(true);
      if (baseWidget) {
        setGlobalData({
          ...baseWidget.widgetSyncedState.globalData,
        })
      }
    }
  });

  let width = 390;
  /* switch (tokenset?.type) {
    case TokenSetType.TypographySet:
      width = 450;
      break;
  }*/

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
      fill={globalData ? '#ffffff' : '#f2f2f2'}
      cornerRadius={10}>
      {header()}
      <AutoLayout 
        name="properties"
        width="fill-parent"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        padding={{top: 10,left: 20,bottom: 0,right: 20}}>
        {satelliteSwitch()}
      </AutoLayout>
    </AutoLayout>
  );
}

