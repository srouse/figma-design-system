import {
  defaultTokenGroup,
  MessageRequest,
} from "../../../shared/index";
import { MessageName } from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";
import refreshLayout from "./layout/refreshLayout";
import { sizing } from "../../../shared/styles";
import { getSelectionSvg } from "./newIcon/addIcon";
import {
  pullTokensFromIconComponentSet
} from "./iconComponentUtils";
import bounceBack, { postPluginMessage } from "../../utils/postMessagePromise";
import addSvgAsIcon from "./newIcon/addSvgAsIcon";
import { findComponentSet } from "./layout/componentSet";
import { findWidget } from "../../utils";
import { LabelMetric } from "./layout/computeLabelMetrics";
import changeIconCompName from "./utils/changeIconCompName";
import { getFullPluginState } from "../../code";

const { widget } = figma;
const {
  AutoLayout,
  useSyncedState,
  Text,
  useWidgetId,
  useEffect,
  Frame,
} = widget;

export default function iconsSatellite() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup ] = useSyncedState(
    'tokenGroup', defaultTokenGroup
  );

  const [compSetHeight, setCompSetHeight] = useSyncedState(
    'compSetHeight', sizing.iconDisplaySize
  );

  const [, setWidgetWidth] = useSyncedState(
    'widgetWidth', sizing.defaultWidgetWidth
  );

  // const [iconsInitialized, setIconsInitialized] = useSyncedState(
  //   'iconsInitialized', false
  // );

  const [, setFontAwesomeApiKey] = useSyncedState(
    'fontAwesomeApiKey', ''
  );

  const [, setFontAwesomeKit] = useSyncedState(
    'fontAwesomeKit', ''
  );

  const [labelMetrics, setLabelMetrics] = useSyncedState(
    'labelMetrics', []
  );

  const [, setIconSizes] = useSyncedState(
    'iconSizes', [12, 24, 32, 40, 48, 56, 62]
  );

  const refreshPluginState = () => {
    postPluginMessage({
      name: 'refreshState',
      state: getFullPluginState(
        nodeId,
        findWidget(nodeId)
      ),
    });
  }

  const rebuildTokens = async () => {
    const start = new Date();
    refreshLayout(
      nodeId,
      tokenGroup,
      setCompSetHeight,
      setWidgetWidth,
      setLabelMetrics,
    );
    await pullTokensFromIconComponentSet(
      tokenGroup, setTokenGroup, nodeId
    );
    refreshPluginState();
    const end = new Date();
    figma.notify(
      `rebuilt icon tokens (${end.getTime() - start.getTime()}ms)`,
    );
  };

  /* useEffect(() => {
    const logSelection = () => {
      console.log('figma.currentPage.selection', figma.currentPage.selection);
    }
    figma.on('selectionchange', logSelection)
    return () => figma.off('selectionchange', logSelection)
  })*/

  useEffect(() => {
    const onMessageHandler = async (message: any) => {
      switch (message.name) {
        case MessageName.promiseBounce :
            switch (message.request) {
              case MessageRequest.createIconFromSVG :
                (async () => {
                  const icon = message.icon;
                  if (!icon) {
                    figma.notify('no icon found', {error: true});
                    bounceBack(message, {success: false});
                    return;
                  }
                  const result = await addSvgAsIcon(
                    icon.svg,
                    icon.name,
                    icon.style,
                    nodeId,
                  );
                  refreshLayout(
                    nodeId,
                    tokenGroup,
                    setCompSetHeight,
                    setWidgetWidth,
                    setLabelMetrics,
                  );
                  rebuildTokens();
                  bounceBack(message, result);
                })();
                break;
              case MessageRequest.changeIconCompName :
                changeIconCompName(nodeId, message.newName);
                bounceBack(message, {success: true});
                break;

              // refresh tokens
              case MessageRequest.createIconFromSelection:
                const svg = await getSelectionSvg();
                if (svg) {
                  bounceBack(message, {svg, success: true});
                  return
                }
                bounceBack(message, {success: false});
                break;
              
              // API KEY
              case MessageRequest.setFontAwesomeAPIKey:
                setFontAwesomeApiKey(message.fontAwesomeApiKey);
                bounceBack(message, {
                  fontAwesomeApiKey: message.fontAwesomeApiKey
                });
                break;

              // Kit
              case MessageRequest.setFontAwesomeKit:
                setFontAwesomeKit(message.fontAwesomeKit);
                bounceBack(message, {
                  fontAwesomeKit: message.fontAwesomeKit
                });
                break;

              // Icon Sizes
              case MessageRequest.setIconSizes:
                setIconSizes(message.iconSizes);
                bounceBack(message, {
                  setIconSizes: message.iconSizes
                });
                break;

              // refresh tokens
              case MessageRequest.refreshIconTokens:
                await rebuildTokens();
                break;

              // delete token
              case MessageRequest.deleteIcon: {
                const thisWidget = findWidget(nodeId);
                const compSet = findComponentSet(thisWidget);
                compSet?.children.map(child => {
                  if (child.id === message.componentId) {
                    child.remove();
                  }
                });
                await rebuildTokens();
                bounceBack(message, {});
                break;
              }

              // Change token name
              case MessageRequest.changeIconTokenName: {
                const thisWidget = findWidget(nodeId);
                const compSet = findComponentSet(thisWidget);
                compSet?.children.map(child => {
                  if (child.id === message.componentId) {
                    child.name = `name=${message.newName}`;
                  }
                });
                await rebuildTokens();
                bounceBack(message, {});
                break;
              }
            }
      }
    };
    figma.ui.on('message', onMessageHandler);
    return () => figma.ui.off('message', onMessageHandler);
  });

  if (tokenGroup.name) {
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        overflow="visible">
        {header(
          rebuildTokens,
        )}
        <Frame
          width="fill-parent"
          height={
            (sizing.iconCompsetPadding*2) +
            compSetHeight
          }
          fill="#eee">
          {labelMetrics.map((labelMetric: LabelMetric) => {
            return (
              <AutoLayout
                key={`${labelMetric.name}`}
                width="hug-contents"
                x={labelMetric.x - 8}
                y={labelMetric.y - 8}
                padding={{
                  top: labelMetric.iconHeight + 10,
                  left: 2, right: 2, bottom: 2,
                }}
                cornerRadius={6}
                fill="#fff">
                <Text
                  fontFamily={typography.primaryFont}
                  fontSize={9}
                  width={sizing.iconDisplaySize + 16}
                  height={32}
                  horizontalAlignText="center"
                  fill={colors.textColor}>
                  {labelMetric.name}
                </Text>
              </AutoLayout>
            );
          })}
        </Frame>
      </AutoLayout>
    );
  }else{
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height={
          sizing.headerHeight + 
          (sizing.iconCompsetPadding*2) + 
          sizing.iconDisplaySize
        }
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        spacing={16}
        overflow="visible">
        {header()}
        <AutoLayout 
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          spacing={0}
          padding={{
            top: 20, bottom: 20,
            left: 20, right: 20
          }}
          overflow="visible">
          <Text
            fontFamily={typography.primaryFont}
            fontWeight="light"
            fontSize={18}
            width="hug-contents"
            horizontalAlignText="center"
            fill={colors.textColorLightest}>
            Icon Tokens Not Found
          </Text>
        </AutoLayout>
      </AutoLayout>
    );
  }
}