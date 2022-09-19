import {
  defaultDesignTokensModel,
  TokenSet,
  TokenSetType
} from "../../shared/types/types";
import {
  openEditor,
} from "../actions/baseActions";
import designSystemClassName from '../../shared/designSystemClassName';
import { findBaseWidget, findNodeParentPage } from "../utils";
import { colors, typography } from "../../shared/styles";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  SVG,
  useSyncedState,
  useWidgetId,
  Rectangle,
} = widget;

const buttonSvgSrc = `
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.2189 0.818689L2.26828 9.76931C2.09772 9.93951 1.99287 10.1646 1.9723 10.4046L1.64316 14.3084C1.63112 14.4495 1.64859 14.5916 1.69446 14.7257C1.74033 14.8597 1.8136 14.9827 1.9096 15.0868C2.00559 15.191 2.12222 15.274 2.25206 15.3307C2.3819 15.3873 2.52211 15.4163 2.66376 15.4158H2.72755L6.71042 15.1606C6.95858 15.1454 7.19266 15.0402 7.36871 14.8646L16.3168 5.91656C16.5776 5.65593 16.7844 5.34647 16.9255 5.00586C17.0667 4.66526 17.1393 4.30019 17.1393 3.9315C17.1393 3.56282 17.0667 3.19775 16.9255 2.85715C16.7844 2.51654 16.5776 2.20708 16.3168 1.94645L15.1814 0.818689C14.6553 0.294396 13.9429 0 13.2001 0C12.4574 0 11.745 0.294396 11.2189 0.818689ZM6.19502 13.15L3.77621 13.3031L3.97522 10.9481L10.6448 4.27851L12.8544 6.4881L6.19502 13.15ZM14.8701 4.47497L14.296 5.04906L12.0864 2.83947L12.6605 2.26538C12.804 2.12204 12.9986 2.04153 13.2014 2.04153C13.4043 2.04153 13.5988 2.12204 13.7423 2.26538L14.8701 3.39314C15.0134 3.53666 15.094 3.73121 15.094 3.93406C15.094 4.1369 15.0134 4.33145 14.8701 4.47497Z" fill="white"/>
  <path d="M19.6465 18.1688H1.0206C0.749918 18.1688 0.490325 18.2763 0.298926 18.4677C0.107527 18.6591 0 18.9187 0 19.1894C0 19.4601 0.107527 19.7197 0.298926 19.9111C0.490325 20.1025 0.749918 20.21 1.0206 20.21H19.6465C19.9172 20.21 20.1768 20.1025 20.3682 19.9111C20.5596 19.7197 20.6671 19.4601 20.6671 19.1894C20.6671 18.9187 20.5596 18.6591 20.3682 18.4677C20.1768 18.2763 19.9172 18.1688 19.6465 18.1688Z" fill="white"/>
  </svg>
`;

export default function header(tokenset: TokenSet | undefined) {
  const nodeId = useWidgetId();

  const [designTokensModel, setDesignTokensModel] = useSyncedState(
    'designTokensModel',
    defaultDesignTokensModel
  );

  const [touch, setTouch] = useSyncedState(
    'touch',
    0
  );

  const [isWindowUIOpen, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
  );

  let title = tokenset?.name || 'No Name Found';
  let subtitle = '';
  switch( tokenset?.type ) {
    case TokenSetType.Base:
      title = designTokensModel?.fullName || '';
      subtitle = 'Design Tokens';
      break;
    case TokenSetType.Undetermined:
      title = designTokensModel?.fullName || '';
      subtitle = 'Design Tokens';
      break;
    case TokenSetType.ColorSet:
    case TokenSetType.TypographySet:
    default :
      subtitle = designSystemClassName(
        designTokensModel,
        tokenset,
      );
      break;
  }

  title = `${title} | ${touch}`;

  return (
    <AutoLayout 
      name="token-set-header"
      width="fill-parent"
      height={65}
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      spacing={9}
      padding={{top: 16,left: 20,bottom: 16,right: 20}}
      fill={isWindowUIOpen ? colors.primary : colors.headerBG}>
      <AutoLayout 
        name="Header Titles"
        width="fill-parent"
        height={33}
        direction="horizontal"
        horizontalAlignItems="start"
        verticalAlignItems="center"
        spacing={8}
        cornerRadius={0}>
        <AutoLayout
          padding={6}
          cornerRadius={4}
          hoverStyle={{
            fill: isWindowUIOpen ? colors.hoverColorLight : colors.hoverColorDark
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
            fontWeight="bold"
            fontSize={15}
            width="hug-contents"
            height="hug-contents"
            fill="#ffffff">
            {designTokensModel.prefix?.toUpperCase()}
          </Text>
        </AutoLayout>
        <Rectangle 
          name="line"
          width={2}
          height={33}
          fill={{r:1, g:1, b:1, a:0.25}}
          cornerRadius={0} />
        <AutoLayout 
          name="titles_box"
          width="fill-parent"
          height="hug-contents"
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          cornerRadius={0}
          padding={{left: 4}}>
          <Text 
            name="Title"
            fontFamily={typography.primaryFont}
            fontWeight="semi-bold"
            fontSize={14}
            width="fill-parent"
            height="hug-contents"
            fill="#ffffff">
            {title}
          </Text>
          <Text 
            name="Set Type"
            fontFamily={typography.primaryFont}
            fontWeight="medium"
            fontSize={12}
            width="fill-parent"
            height="hug-contents"
            fill="#ffffff">
            {subtitle}
          </Text>
        </AutoLayout>
        <AutoLayout
          padding={6}
          cornerRadius={4}
          hoverStyle={{
            fill: isWindowUIOpen ? colors.hoverColorLight : colors.hoverColorDark
          }}
          onClick={async () => {
            // nodeToImage();
            setIsWindowUIOpen(true);
            return openEditor(nodeId);
          }}>
          <SVG
            src={buttonSvgSrc}
          />
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>

  );
}
