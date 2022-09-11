import {
  colors,
  typography
} from "../../shared/styles";
import {
  defaultDesignSystemModel,
  DesignSystemModel,
  TokenSet,
  TokenSetCategory
} from "../../shared/types";
import designSystemClassName from '../../shared/designSystemClassName';
import { TokenSetType } from "../../shared/enums";
import tokensetTypeToName from '../../shared/tokensetTypeToName';
import {
  findNodeParentPage,
  findWidget,
  sortIntoCategories
} from "../utils";
import button from "../components/button";
import { triggerBaseRefresh } from "../actions/baseActions";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Rectangle,
  useSyncedState,
} = widget;

export default function baseSatellite() {
  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
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
      {renderWidgetList(designSystemModel)}
      {button('Refresh', () => triggerBaseRefresh())}
    </AutoLayout>
  );
}

function renderWidgetList(
  designSystemModel: DesignSystemModel
) {
  const categorizedTokensets = sortIntoCategories(designSystemModel.tokensets);

  const html: any[] = [];
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
                    const widget = findWidget(tokenset.nodeId);
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
                    {tokenset.name}
                  </Text>
                  <Text
                    fontFamily={typography.primaryFont}
                    fontWeight="normal"
                    fontSize={11}
                    width="fill-parent"
                    fill={colors.textColor}>
                    {designSystemClassName(
                      designSystemModel,
                      tokenset )}
                  </Text>
                </AutoLayout>
              );
            })}
        </AutoLayout>
      </AutoLayout>
    ));


    
  });
  return html;
}

