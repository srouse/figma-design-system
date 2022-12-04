import {
  defaultTokenGroup,
} from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  useWidgetId,
  useEffect,
  Rectangle
} = widget;

export default function componentsSatellite() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [effectsInitialized, setEffectsInitialized] = useSyncedState(
    'effectsInitialized',
    false
  );

  useEffect(() => {
    if (!effectsInitialized) {
      setEffectsInitialized(true);
      // first run ever
    }
  });

  return (
    <AutoLayout 
        name="base-page"
        height="hug-contents"
        width="fill-parent"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={24}
        overflow="visible">
        {header(
          () => {
            setEffectsInitialized(false);
          },
          () => {
            
          }
        )}
        <AutoLayout 
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          spacing={0}
          padding={{
            top: 0, bottom: 20,
            left: 20, right: 20
          }}
          overflow="visible">
          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={0}
            padding={{
              top: 10, bottom: 10,
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
              No Component Token
            </Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
  );
}

