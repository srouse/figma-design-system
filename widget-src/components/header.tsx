import {
  defaultGlobalData,
  defaultTokenGroup,
} from "../../shared/types/types";
import {
  openEditor,
} from "../actions/baseActions";
import { findBaseWidget, findNodeParentPage } from "../utils";
import { colors, typography } from "../../shared/styles";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import getIcon, { Icons } from "../../shared/icons";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  SVG,
  useSyncedState,
  useWidgetId,
  Rectangle,
} = widget;
 
export default function header(
  refreshCallback?: () => void,
  openEditorCallback?:  () => void
) {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [globalData, setGlobalData] = useSyncedState(
    'globalData',
    defaultGlobalData
  );

  const [touch, setTouch] = useSyncedState(
    'touch',
    0
  );

  const [isWindowUIOpen, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  let title = tokenGroup?.name || 'No Name';
  const hasName = tokenGroup?.name ? true : false;
  // let subtitle = '';
  switch( tokenGroup?.type ) {
    case DSysGroupType.Base:
      title = globalData?.fullName || '';
      // subtitle = 'Design Tokens';
      break;
    case DSysGroupType.Undetermined:
      title = globalData?.fullName || '';
      // subtitle = 'Design Tokens';
      break;
    case DSysGroupType.ColorSet:
    case DSysGroupType.TypographySet:
    default :
      // subtitle = tokenGroupTypeToName(tokenGroup);
      break;
  }

  title = `${title}`;// | ${touch}`;

  return (
    <AutoLayout 
      name="token-set-header"
      width="fill-parent"
      height="hug-contents"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      fill={isWindowUIOpen ? colors.primary : colors.headerBG}>
      <AutoLayout 
        name="Header Titles"
        width="fill-parent"
        height="hug-contents"
        direction="horizontal"
        horizontalAlignItems="start"
        verticalAlignItems="center"
        spacing={12}
        cornerRadius={0}
        padding={{
          top: 16, bottom: 16,
          left: 16,right: 16}}>
        <AutoLayout
          padding={6}
          cornerRadius={4}
          hoverStyle={{
            fill: isWindowUIOpen ? 
              colors.hoverBgColorDark : colors.hoverBgColorLight
          }}
          onClick={() => {
            // focus on base
            const base = findBaseWidget();
            if (base) {
              const basePage = findNodeParentPage(base);
              if (basePage) {
                figma.currentPage = basePage;
              }
              figma.viewport.scrollAndZoomIntoView([base]);
            }
          }}>
          <Text 
            name="SCU"
            fontFamily={typography.primaryFont}
            fontWeight="normal"
            fontSize={18}
            width="hug-contents"
            height="hug-contents"
            fill={isWindowUIOpen ? 
              colors.white : colors.textColor}>
            {globalData.prefix?.toUpperCase()}
          </Text>
        </AutoLayout>
        <Rectangle 
          name="line"
          width={2}
          height={33}
          fill={isWindowUIOpen ? 
            colors.white : colors.borderGrey}
          opacity={isWindowUIOpen ? 0.2 : 1}
          cornerRadius={0} />
        <Text 
          name="Title"
          fontFamily={typography.primaryFont}
          fontWeight="normal"
          fontSize={hasName ? 18 : 16}
          width="fill-parent"
          height="hug-contents"
          fill={isWindowUIOpen ? 
            colors.white : 
            hasName ? colors.textColor : colors.greyLighter}>
          {title}
        </Text>
        <AutoLayout
          spacing={2}>
          <AutoLayout
            padding={6}
            cornerRadius={4}
            hoverStyle={{
              fill: isWindowUIOpen ? 
                colors.hoverBgColorDark : colors.hoverBgColorLight
            }}
            onClick={() => {
              if (refreshCallback) refreshCallback();
            }}>
            <SVG
              src={getIcon(
                Icons.refresh,
                isWindowUIOpen ? colors.white : colors.textColor
              )}
            />
          </AutoLayout>
          {tokenGroup.type !== DSysGroupType.Undetermined ? 
            (<AutoLayout
              padding={6}
              cornerRadius={4}
              hoverStyle={{
                fill: isWindowUIOpen ? 
                  colors.hoverBgColorDark : colors.hoverBgColorLight
              }}
              onClick={() => {
                setIsWindowUIOpen(true);
                if (openEditorCallback) {
                  openEditorCallback();
                }
                return openEditor();
              }}>
              <SVG
                src={getIcon(
                  Icons.edit,
                  isWindowUIOpen ? colors.white : colors.textColor
                )}
              />
            </AutoLayout>) : null
          }
        </AutoLayout>
      </AutoLayout>
      <Rectangle 
        height={1}
        width="fill-parent"
        fill={colors.borderGrey} />
    </AutoLayout>

  );
}
