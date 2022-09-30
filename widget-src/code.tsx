import { 
  defaultGlobalData,
  defaultTokenGroup,
  defaultTokenGroupLookup,
  MessageName,
  MessageRequest,
} from "../shared/types/types";
import { updateBaseWidgetTokenGroupLookup } from "./actions/baseActions";
import getStyles, { getColorStyles, getEffectStyles, getTextStyles } from "./actions/getStyles";
import designSystem from "./designTokens";
import { findAllWidgets, findWidget } from "./utils";
import bounceBack from "./utils/postMessagePromise";
const { 
  widget,
} = figma;
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
          case MessageName.globalDataUpdate:
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
          case MessageName.tokenGroupUpdate:
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
          case MessageName.promiseBounce :
            switch (message.request) {
              case MessageRequest.stateUpdate:
                const thisWidget = findWidget(nodeId);
                bounceBack(message, {
                  nodeId,
                  globalData: thisWidget.widgetSyncedState.globalData,
                  tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
                });
                break;
              case MessageRequest.getStyles:
                getStyles(message);
                break;
              case MessageRequest.getColorStyles:
                getColorStyles(message);
                break;
              case MessageRequest.getTextStyles:
                getTextStyles(message);
                break;
              case MessageRequest.getEffectStyles:
                getEffectStyles(message);
                break;
            }
            break;
        }
      }
    }
  })

  return designSystem();
}
widget.register(Widget);
