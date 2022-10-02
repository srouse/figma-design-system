import button from "../components/button";
import { triggerAllWidgetRefresh } from "../actions/baseActions";
import { findNodeParentPage, findWidget } from "../utils";
import { colors, typography } from "../../shared/styles";
import { defaultGlobalData, defaultTokenGroupLookup, TokenGroupLookup } from "../../shared/types/types";
import processClassName from "../../shared/processClassName";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useWidgetId,
  useSyncedState,
} = widget;

export default function base() {

  const nodeId = useWidgetId();

  const [tokenGroupLookup, setTokenGroupLookup] = useSyncedState(
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
      <Text>Base Widget</Text>
      {renderWidgetList(tokenGroupLookup, nodeId)}
      {button('Refresh All', () => triggerAllWidgetRefresh())}
    </AutoLayout>
  );
}


function renderWidgetList(
  allTokenGroups: TokenGroupLookup[],
  nodeId: string,
) {

  const [globalData, setGlobalData] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const html: any[] = [];
  allTokenGroups?.map(tokenGroup => {
    if (tokenGroup.widgetId === nodeId) return;
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
          fill: colors.hoverColor,
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
          {tokenGroup.tokenGroupName}
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

  /*
  categorizedTokensets.map((tokensetCategory: TokenSetCategory) => {
    if (tokensetCategory.type === TokenSetType.Base) {
      return;
    }

    html.push((
      <AutoLayout
        width="fill-parent"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={4}
        key={`list-${tokensetCategory.type}`}>
        <AutoLayout
          width="fill-parent"
          height="hug-contents"
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={4}
          padding={{horizontal: 4, vertical: 0}}>
          <Text
            fontFamily={typography.primaryFont}
            fontWeight="normal"
            fontSize={10}
            width="fill-parent"
            fill={colors.textColorLighter}>
            {tokensetTypeToName(tokensetCategory).toUpperCase()}
          </Text>
          <Rectangle
            width="fill-parent"
            height={1}
            fill={colors.borderGrey} />
        </AutoLayout>
        <AutoLayout
          width="fill-parent"
          height="hug-contents"
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={8}>
          {tokensetCategory.tokensets.map((tokenset: TokenSet) => {
              return (
                <AutoLayout
                  width="fill-parent"
                  height="hug-contents"
                  direction="vertical"
                  horizontalAlignItems="start"
                  verticalAlignItems="start"
                  spacing={2}
                  padding={{horizontal: 4, vertical: 6}}
                  cornerRadius={4}
                  key={`list-${tokensetCategory.type}-${tokenset.name}`}
                  hoverStyle={{
                    fill: colors.hoverColor,
                  }}
                  onClick={() => {
                    /*
                    const widget = findWidget(tokenset.nodeId);
                    const page = findNodeParentPage(widget);
                    if (page) {
                      figma.currentPage = page;
                    }
                    figma.viewport.scrollAndZoomIntoView([widget]);
                    * /
                  }}>
                  <Text
                    fontFamily={typography.primaryFont}
                    fontWeight="medium"
                    fontSize={14}
                    width="fill-parent"
                    fill={colors.textColor}>
                    {tokenset.name}
                  </Text>
                  <Text
                    fontFamily={typography.primaryFont}
                    fontWeight="normal"
                    fontSize={11}
                    width="fill-parent"
                    fill={colors.textColor}>
                    {/*designSystemClassName(
                      designTokensModel,
                    tokenset )* /}
                  </Text>
                </AutoLayout>
              );
            })}
        </AutoLayout>
      </AutoLayout>
    ));
  });
  */
}

