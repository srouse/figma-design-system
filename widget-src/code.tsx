import { 
  defaultGlobalData,
  defaultTokenGroup,
  defaultTokenGroupLookup,
  MessageTypes,
  TokenGroupLookup,
} from "../shared/types/types";
import { triggerBaseRefresh, updateBaseWidgetTokenGroupLookup } from "./actions/baseActions";
import designSystem from "./designTokens";
import { findAllWidgets, findBaseWidget, findWidget } from "./utils";
const { widget } = figma;
const {
  useEffect,
  useSyncedState,
  useWidgetId,
} = widget;

function Widget() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [globalData, setGlobalData] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const [isWindowUIOpen, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  const [tokenGroupLookup, setTokenGroupLookup] = useSyncedState(
    'tokenGroupLookup',
    defaultTokenGroupLookup
  );

  useEffect(() => {
    // only the open widget should listen to events...
    if (isWindowUIOpen) {
      figma.ui.onmessage = (message) => {
        console.log('RECIEVE MSG', nodeId, message);
        switch (message.name) {
          case MessageTypes.globalDataUpdate:
            setGlobalData(message.globalData);
            // distribute to others...
            const allWidgets = findAllWidgets(nodeId);
            allWidgets.map(widget => {
              widget.setWidgetSyncedState({
                ...widget.widgetSyncedState,
                globalData: message.globalData,
              })
            });
            break;
          case MessageTypes.tokenGroupUpdate:
            // update base's token group lookup for index display...
            // tell the base something changed
            let doUpdate = false;
            const thisWidget = findWidget(nodeId);
            const widgetTokenGroup = thisWidget.widgetSyncedState.tokenGroup;
            if (
              widgetTokenGroup && 
              widgetTokenGroup.name !== message.tokenGroup.name
            ) {
              doUpdate = true;
            }
            
            // update local token group
            setTokenGroup(message.tokenGroup);
            if (doUpdate) updateBaseWidgetTokenGroupLookup();
            break;
        }
      }
    }
  })

  return designSystem();
}
widget.register(Widget);
