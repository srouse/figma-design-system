import { defaultTokenGroup } from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";
import { pullTokensFromTextStyles } from "./typographyUtils";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useWidgetId,
  useSyncedState,
  useEffect,
} = widget;

export default function typographySatellite() {
  const nodeId = useWidgetId();

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [typographyInitialized, setTypographyInitialized] = useSyncedState(
    'typographyInitialized',
    false
  );

  useEffect(() => {
    if (!typographyInitialized) {
      setTypographyInitialized(true);
      pullTokensFromTextStyles(
        tokenGroup, setTokenGroup, nodeId
      );
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
            setTypographyInitialized(false);
          },
          () => {
            pullTokensFromTextStyles(
              tokenGroup,
              setTokenGroup,
              nodeId
            );
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
            top: 0, bottom: 10,
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
            Typography Tokens Not Found
          </Text>
        </AutoLayout>
      </AutoLayout>
  );
}