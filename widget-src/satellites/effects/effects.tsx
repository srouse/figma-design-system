import { cleanAndSortTokens, defaultTokenGroup, DSysShadowToken } from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import { DSysBlurToken } from "../../../shared/types/designSystemTypes";
import { DTBlurToken, DTShadowToken } from "../../../shared/types/designTokenTypes";
import header from "../../components/header";
import { pullTokensFromEffectStyles } from "./effectsUtils";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  useWidgetId,
  useEffect,
} = widget;

export default function effectsSatellite() {
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
      pullTokensFromEffectStyles(
        tokenGroup, setTokenGroup, nodeId
      );
    }
  });

  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  const tokenOutput = tokens.map(
    (tokenInfo, index) => {
      const token = tokenInfo[1] as DSysShadowToken | DSysBlurToken;
      // const effect = token.$value;// as DTShadowToken | DTBlurToken;
      return (
        <AutoLayout
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          overflow="visible"
          verticalAlignItems="center"
          padding={{
            top: 0,left: 20,
            bottom: 0,right: 20
          }}
          key={`row_${
            token.$extensions['dsys.styleId']
          }`}>
          <Text
            fontFamily={typography.primaryFont}
            fontWeight="normal"
            fontSize={14}
            fill={colors.textColor}
            width="fill-parent"
            height="hug-contents">
            {token.$extensions["dsys.name"]}
          </Text>
        </AutoLayout>
      );
    }
  );

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
            pullTokensFromEffectStyles(
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
            Effect Tokens Not Found
          </Text>
          {tokenOutput}
        </AutoLayout>
      </AutoLayout>
  );
}