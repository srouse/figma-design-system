import { triggerAllWidgetRefresh } from "../actions/baseActions";
import { findNodeParentPage, findWidget } from "../utils";
import { colors, sizing, typography } from "../../shared/styles";
import {
  defaultGlobalData,
  defaultTokenGroupCategorizedLookup,
  MessageName,
  MessageRequest,
  TokenGroupLookup
} from "../../shared/types/types";
import header from "../components/header";
import baseCategoryHeader from "./components/baseCategoryHeader";
import { Icons } from "../../shared/icons";
import createNewTokenset from "./actions/createNewTokenset";
import bounceBack from "../utils/postMessagePromise";
import baseFirstRun from "./components/baseFirstRun";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useWidgetId,
  useSyncedState,
  Rectangle,
  useEffect,
} = widget;

export default function base() {
  const nodeId = useWidgetId();

  const [tokenGroupCategorizedLookup, ] = useSyncedState(
    'tokenGroupCategorizedLookup',
    defaultTokenGroupCategorizedLookup
  );

  const [widgetWidth, setWidgetWidth] = useSyncedState(
    'widgetWidth',
    sizing.defaultWidgetWidth
  );

  const [isWindowUIOpen,] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  const [globalData, ] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const baseWidgetWidth = 783;
  const isFirstRun = !globalData.fullName;

  useEffect(() => {
    if (isFirstRun) {
      if(widgetWidth !== sizing.defaultWidgetWidth) {
        setWidgetWidth(sizing.defaultWidgetWidth);
      }
    }else{
      if (widgetWidth !== baseWidgetWidth) {
        setWidgetWidth(baseWidgetWidth);
      }
    }

    const onMessageHandler = async (message: any) => {
      switch (message.name) {
        case MessageName.promiseBounce :
          switch (message.request) {
            case MessageRequest.getCategorizedTokenGroups :
              bounceBack(message, {
                categorizedTokenGroups: tokenGroupCategorizedLookup,
                baseNodeId: nodeId,
              });
              break;
            case MessageRequest.focusOnToken :
              let node = figma.getNodeById(message.nodeId);
              if (node) {
                let page = node.parent;
                while (page && (page.type !== 'PAGE')) {
                  page = page.parent;
                }
                if (page) figma.currentPage = page;
                figma.viewport.scrollAndZoomIntoView([node]);
              }
              bounceBack(message, {});
              break;
          }
      }
    };
    figma.ui.on('message', onMessageHandler);
    return () => figma.ui.off('message', onMessageHandler);
  });

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="start">
      {isFirstRun ? (
        baseFirstRun()
      ) : (<>
        {header(
          () => {
            triggerAllWidgetRefresh();
          },
          undefined, undefined,
          () => {
            if (isFirstRun) {
              return null;
            }
            return (
              <AutoLayout
                direction="horizontal"
                cornerRadius={6}
                stroke={isWindowUIOpen ? colors.white : colors.borderGrey}
                padding={{horizontal: 20, vertical: 9}}
                hoverStyle={{
                  fill: isWindowUIOpen ? 
                    colors.hoverBgColorDark : colors.hoverBgColorLight,
                }}
                onClick={() => {
                  createNewTokenset(nodeId)
                }}>
                <Text
                  fontFamily={typography.primaryFont}
                  fontSize={12}
                  fill={isWindowUIOpen ? colors.white : colors.textColor}>
                  Add TokenSet
                </Text>
              </AutoLayout>
            );
          }
        )}
        <AutoLayout 
          height="hug-contents"
          direction="horizontal"
          width="fill-parent"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={20}
          padding={{
            top: 40, bottom: 40,
            left: 46, right: 46
          }}
          overflow="visible">

          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="start"
            verticalAlignItems="start"
            spacing={14}>
            {renderCategory(
              `Colors`,
              Icons.colors,
              tokenGroupCategorizedLookup.colors,
              nodeId,
            )}
            {renderHorizontalLine()}
            {renderCategory(
              `Typography`,
              Icons.typography,
              tokenGroupCategorizedLookup.typography,
              nodeId,
            )}
            {renderHorizontalLine()}
            {renderCategory(
              `Effects`,
              Icons.effects,
              tokenGroupCategorizedLookup.effects,
              nodeId,
            )}
          </AutoLayout>

          {renderVerticalLine()}

          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="start"
            verticalAlignItems="start"
            spacing={14}>
            {renderCategory(
              `Icons`,
              Icons.icons,
              tokenGroupCategorizedLookup.icons,
              nodeId,
            )}
            {renderHorizontalLine()}
            {renderCategory(
              `Spacing`,
              Icons.spacing,
              tokenGroupCategorizedLookup.spacing,
              nodeId,
            )}
            {renderHorizontalLine()}
            {renderCategory(
              `Breakpoints`,
              Icons.breakpoint,
              tokenGroupCategorizedLookup.breakpoints,
              nodeId,
            )}
            {renderHorizontalLine()}
            {renderCategory(
              `Custom`,
              Icons.custom,
              tokenGroupCategorizedLookup.custom,
              nodeId,
            )}
          </AutoLayout>

          {renderVerticalLine()}

          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="start"
            verticalAlignItems="start"
            spacing={14}>
            {renderCategory(
              `Components`,
              Icons.component,
              tokenGroupCategorizedLookup.components,
              nodeId,
            )}
          </AutoLayout>

        </AutoLayout>
      </>)}
    </AutoLayout>
  );
}

function renderHorizontalLine() {
  return (
    <Rectangle
      height={1}
      width="fill-parent"
      fill={colors.borderGrey} />
  );
}

function renderVerticalLine() {
  return (
    <Rectangle
      width={1}
      height="fill-parent"
      fill={colors.borderGrey} />
  );
}

function renderCategory(
  categoryTitle: string,
  icon: Icons,
  allTokenGroups: TokenGroupLookup[],
  nodeId: string,
) {
  return (
    <AutoLayout 
      height="hug-contents"
      direction="vertical"
      width="fill-parent"
      horizontalAlignItems="start"
      verticalAlignItems="start"
      padding={{
        top: 0, bottom: 0,
        left: 0, right: 0
      }}
      overflow="visible">
      {baseCategoryHeader(
        categoryTitle,
        icon,
      )}
      {allTokenGroups.length === 0 ? (
        <AutoLayout
          width="fill-parent"
          height="hug-contents"
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          padding={{
            left: 34, right: 0,
            top: 4, bottom: 4,
          }}
          cornerRadius={4}
          onClick={() => {
            createNewTokenset(nodeId);
          }}>
          <Text
            fontFamily={typography.primaryFont}
            fontSize={14}
            width="fill-parent"
            fill={colors.primaryLight}
            hoverStyle={{
              fill: colors.primary,
            }}>
            add tokenset 
          </Text>
        </AutoLayout>
      ) : null}
      {allTokenGroups?.map(tokenGroup => {
        return (
          <AutoLayout
            width="fill-parent"
            height="hug-contents"
            direction="vertical"
            horizontalAlignItems="start"
            verticalAlignItems="start"
            padding={{
              left: 34, right: 0,
              top: 4, bottom: 4,
            }}
            cornerRadius={4}
            key={`list-${tokenGroup.nodeId}`}
            onClick={() => {
              const widget = findWidget(tokenGroup.nodeId);
              const page = findNodeParentPage(widget);
              if (page) {
                figma.currentPage = page;
              }
              figma.viewport.scrollAndZoomIntoView([widget]);
            }}>
            <Text
              fontFamily={typography.primaryFont}
              fontSize={14}
              width="fill-parent"
              fill={colors.textColor}
              hoverStyle={{
                fill: colors.primary,
              }}>
              {tokenGroup.tokenGroupName}
            </Text>
          </AutoLayout>)
      })}
    </AutoLayout>
  );
}
