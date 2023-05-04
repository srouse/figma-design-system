import { 
  defaultTokenGroup,
  MessageName,
  MessageRequest,
} from "../shared/types/types";
import { triggerAllWidgetRefresh, updateBaseWidgetTokenGroupLookup } from "./actions/baseActions";
import createDesignTokens from "./actions/createDesignTokens";
import getStyles, { getColorStyles, getEffectStyles, getTextStyles, paintStyles } from "./actions/getStyles";
import designSystem from "./designTokens";
import { findAllWidgets, findBaseWidget, findWidget } from "./utils";
import bounceBack from "./utils/postMessagePromise";
import { updateStyle } from "./actions/updateStyle";
import refreshTokensFromStyles from "./actions/refreshTokensFromStyles";
import createStyle from "./actions/createStyle";
import changeStylesFolder from "./actions/changeStylesFolder";
import updateTokenGroup from "./actions/updateTokenGroup";
import moveStyle from "./actions/moveStyle";
import componentScss from "./actions/componentScss";

const { 
  widget,
} = figma;
const {
  useEffect,
  useSyncedState,
  useWidgetId,
} = widget;

export function getFullPluginState(
  nodeId: string,
  thisWidget: WidgetNode
) {
  return {
    nodeId,
    globalData: thisWidget.widgetSyncedState.globalData,
    tokenGroup: thisWidget.widgetSyncedState.tokenGroup,
    fontAwesomeApiKey:
      thisWidget.widgetSyncedState.fontAwesomeApiKey,
    fontAwesomeKit:
      thisWidget.widgetSyncedState.fontAwesomeKit,
    iconSizes:
      thisWidget.widgetSyncedState.iconSizes,
  }
}

function Widget() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [isWindowUIOpen,] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  useEffect(() => {
    // only the open widget should listen to events...
    if (isWindowUIOpen) {
      figma.ui.onmessage = async (message) => {
        console.log('-> RECIEVE MSG', message);
        switch (message.name) {
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
                  bounceBack(message, getFullPluginState(nodeId, thisWidget));
                }
                break;
              case MessageRequest.globalDataUpdate:
                const rootWidget = findBaseWidget();
                if (!rootWidget) return;
                rootWidget.setWidgetSyncedState({
                  ...rootWidget.widgetSyncedState,
                  globalData: message.globalData,
                });
                triggerAllWidgetRefresh();
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
                  {
                    error: message.error === true ? true : false,
                    timeout: message.timeout ? message.timeout : 2000,
                    /* button: message.button ? {
                      text: 'ok',
                      action: () => {}
                    } : undefined */
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
                  const designTokenResults = await createDesignTokens();
                  bounceBack(message, {designTokenResults});
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
              case MessageRequest.getComponentScss :
                // we have to transform the components in the widget
                const componentScssResults = await componentScss( message.componentId );
                bounceBack(message, {results:componentScssResults});
            }
            break;
        }
      }
    }
  })
  return designSystem();
}
widget.register(Widget);
