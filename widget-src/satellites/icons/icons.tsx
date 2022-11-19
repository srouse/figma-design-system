import { defaultTokenGroup } from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";
import refreshLayout from "./layout/refreshLayout";
import { sizing } from "../../../shared/styles";
import addIcon from "./newIcon/addIcon";

const { widget } = figma;
const {
  AutoLayout,
  useSyncedState,
  Text,
  useWidgetId,
} = widget;

export default function iconsSatellite() {

  const nodeId = useWidgetId();

  const [tokenGroup, ] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [compSetHeight, setCompSetHeight] = useSyncedState(
    'compSetHeight',
    sizing.iconDisplaySize
  );

  // TODO: get this to init correctly...need the default token, maybe on naming

  if (tokenGroup.name) {
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height={
          sizing.headerHeight + 
          (sizing.iconSpacing*2) +
          compSetHeight - 15 // some slop from somewhere?
        }
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        overflow="visible">
        {header(
          () => {
            refreshLayout(
              nodeId,
              tokenGroup,
              setCompSetHeight
            );
          },
          undefined,
          () => {
            addIcon(nodeId);
            refreshLayout(
              nodeId,
              tokenGroup,
              setCompSetHeight
            );
          }
        )}
        <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            overflow="visible">
          </AutoLayout>
      </AutoLayout>
    );
  }else{
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        height={
          sizing.headerHeight + 
          (sizing.iconSpacing*2) + 
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