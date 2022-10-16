import { 
  defaultGlobalData,
  defaultTokenGroup,
  defaultTokenGroupLookup,
  MessageName,
  MessageRequest,
  MessageRequestStyle,
  TokenGroup,
} from "../shared/types/types";
import { colorStylesToDSysTokenset, colorTokenGroupToStyles, pullTokensFromColorStyles } from "./satellites/colors/colorStyleUtils";
import { updateBaseWidgetTokenGroupLookup } from "./actions/baseActions";
import createDesignTokens from "./actions/createDesignTokens";
import getStyles, { getColorStyles, getEffectStyles, getTextStyles, paintStyles } from "./actions/getStyles";
import designSystem from "./designTokens";
import { findAllWidgets, findWidget } from "./utils";
import bounceBack from "./utils/postMessagePromise";
import { DSysColorToken, DSysGroupType, DSysToken, DSysTokenset, DTTokenType, hexToRgb, validColor } from "../shared/index";
import { updateStyle } from "./actions/updateStyle";
import refreshTokensFromStyles from "./actions/refreshTokensFromStyles";
import createStyle from "./actions/createStyle";
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
            // PUSH TO STYLES...
            colorTokenGroupToStyles(message.tokenGroup);

            // update local token group
            setTokenGroup({
              ...message.tokenGroup,
            });
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
              case MessageRequest.notify:
                console.log(message)
                figma.notify(
                  message.message,
                  {
                    error: message.error === true ? true : false,
                  }
                );
                break;

              case MessageRequest.refreshTokensFromStyles:
                refreshTokensFromStyles(
                  message, tokenGroup, setTokenGroup, nodeId,
                );
                break;
              case MessageRequest.getFinalTokens:
                (async () => {
                  const tokens = await createDesignTokens();
                  bounceBack(message, {
                    tokens,
                  });
                })();
                break;
              case MessageRequest.moveStyle:
                if (message.type === MessageRequestStyle.color) {
                  const targetStyle = figma.getStyleById(message.styleId) as PaintStyle;
                  const previousStyle = figma.getStyleById(message.previousStyleId) as PaintStyle;
                  if (!targetStyle) return;

                  if (targetStyle === previousStyle) {
                    // not doing anything is a right answer here
                    return bounceBack(message, {success: true});
                  }
                  
                  figma.moveLocalPaintStyleAfter(
                    targetStyle, previousStyle || null
                  );
                  bounceBack(message, {success: true});
                }
                bounceBack(message, {success: false, message: 'no type found'});
                break;
              case MessageRequest.updateStyle:
                return updateStyle(message, tokenGroup);
              case MessageRequest.deleteStyle:
                if (message.styleId) {
                  const style = figma.getStyleById(message.styleId);
                  if (style) style.remove();
                  bounceBack(message, {success: true});
                }
                bounceBack(message, {success: false});
                break;
              case MessageRequest.createStyle:
                createStyle(message);
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
