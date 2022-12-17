import button from "../components/button";
import { triggerAllWidgetRefresh } from "../actions/baseActions";
import { findNodeParentPage, findWidget } from "../utils";
import { colors, typography } from "../../shared/styles";
import { defaultGlobalData, defaultTokenGroupLookup, TokenGroupLookup } from "../../shared/types/types";
import processClassName from "../../shared/processClassName";
import header from "../components/header";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useWidgetId,
  useSyncedState,
} = widget;

export default function base() {

  const nodeId = useWidgetId();

  const [tokenGroupLookup, ] = useSyncedState(
    'tokenGroupLookup',
    defaultTokenGroupLookup
  );

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="start"
      spacing={26}>
      {header(
        () => {
          triggerAllWidgetRefresh()
        }
      )}
      <AutoLayout 
        height="hug-contents"
        direction="vertical"
        width="fill-parent"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={10}
        padding={{
          top: 0, bottom: 20,
          left: 20, right: 20
        }}
        overflow="visible">
        <Text>Base Widget</Text>
        {renderWidgetList(tokenGroupLookup, nodeId)}
      </AutoLayout>
    </AutoLayout>
  );
}


function renderWidgetList(
  allTokenGroups: TokenGroupLookup[],
  nodeId: string,
) {

  const [globalData,] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const html: any[] = [];
  allTokenGroups?.map(tokenGroup => {
    if (tokenGroup.widgetId === nodeId) return;// it's the base

    html.push(
      <AutoLayout
        width="fill-parent"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={2}
        padding={{horizontal: 4, vertical: 6}}
        cornerRadius={4}
        key={`list-${tokenGroup.widgetId}`}
        hoverStyle={{
          fill: colors.hoverBgColor,
        }}
        onClick={() => {
          const widget = findWidget(tokenGroup.widgetId);
          const page = findNodeParentPage(widget);
          if (page) {
            figma.currentPage = page;
          }
          figma.viewport.scrollAndZoomIntoView([widget]);
        }}>
        <Text
          fontFamily={typography.primaryFont}
          fontWeight="medium"
          fontSize={14}
          width="fill-parent"
          fill={colors.textColor}>
          {`${tokenGroup.tokenGroupName} ${tokenGroup.tokenGroupType}`}
        </Text>
        <Text
          fontFamily={typography.primaryFont}
          fontWeight="normal"
          fontSize={11}
          width="fill-parent"
          fill={colors.textColor}>
          {processClassName(
            globalData.prefix,
            tokenGroup.tokenGroupName
            )}
        </Text>
      </AutoLayout>
    );
  });

  return html;
}
