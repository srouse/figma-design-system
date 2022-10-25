import { 
  defaultGlobalData,
  defaultTokenGroup,
  defaultTokenGroupLookup,
  MessageName,
  MessageRequest,
  MessageRequestStyle,
} from "../shared/types/types";
import { updateBaseWidgetTokenGroupLookup } from "./actions/baseActions";
import createDesignTokens from "./actions/createDesignTokens";
import getStyles, { getColorStyles, getEffectStyles, getTextStyles, paintStyles } from "./actions/getStyles";
import designSystem from "./designTokens";
import { findAllWidgets, findWidget } from "./utils";
import bounceBack from "./utils/postMessagePromise";
import { updateStyle } from "./actions/updateStyle";
import refreshTokensFromStyles from "./actions/refreshTokensFromStyles";
import createStyle from "./actions/createStyle";
import changeStylesFolder from "./actions/changeStylesFolder";
import updateTokenGroup from "./actions/updateTokenGroup";
import moveStyle from "./actions/moveStyle";
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
      figma.ui.onmessage = async (message) => {
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
            setTokenGroup({
              ...message.tokenGroup,
            });
            if (doUpdate) updateBaseWidgetTokenGroupLookup();
            break;
          case MessageName.promiseBounce :
            switch (message.request) {
              case MessageRequest.stateUpdate:
                {
                  const thisWidget = findWidget(nodeId);
                  bounceBack(message, {
                    nodeId,
                    globalData: thisWidget.widgetSyncedState.globalData,
                    tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
                  });
                }
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
                figma.notify(
                  message.message,
                  {error: message.error === true ? true : false}
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
                return moveStyle(message);
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
                return createStyle(message);
              case MessageRequest.changeStylesFolder:
                changeStylesFolder(
                  message.folderName,
                  message.newFolderName,
                  message.type
                );
                bounceBack(message, {success: true});
                break;
              case MessageRequest.updateTokenGroup:
                updateTokenGroup(
                  nodeId,
                  message.tokenGroup,
                  setTokenGroup
                )
                bounceBack(message, {success: true});
                break;
              case MessageRequest.getAvailableFonts :
                const fonts = await figma.listAvailableFontsAsync();
                bounceBack(message, {fonts});
            }
            break;
        }
      }
    }
  })

  return designSystem();
}
widget.register(Widget);
