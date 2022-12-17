import {
  cleanAndSortTokens,
  defaultTokenGroup,
  DTTokenType,
  TokenGroup
} from "../../../shared/index";
import { colors, typography } from "../../../shared/styles";
import { DSysBlurToken, DSysShadowToken } from "../../../shared/types/designSystemTypes";
import { hexToRgbObj, RGBType } from "../../../shared/utils/colorUtils";
import header from "../../components/header";
import { pullTokensFromEffectStyles } from "./effectsUtils";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  useWidgetId,
  useEffect,
  Rectangle
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

  const effectList = getEffectList(tokenGroup);

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
            top: 0, bottom: 20,
            left: 20, right: 20
          }}
          overflow="visible">
          {effectList && effectList.length ? 
            effectList : (
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
                No Effect Tokens
              </Text>
            </AutoLayout>
          )}
        </AutoLayout>
      </AutoLayout>
  );
}



function getEffectList(
  tokenGroup: TokenGroup
) {
  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  if (!tokens) return false;
  return tokens.map(
    (tokenInfo, index) => {
      const token = tokenInfo[1] as DSysBlurToken | DSysShadowToken;
      const shadowToken = (token.$type === DTTokenType.shadow) ?
        token as DSysShadowToken : false;
      const blurToken = (token.$type === DTTokenType.blur) ?
        token as DSysBlurToken : false;
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
          <AutoLayout
            height={50}
            verticalAlignItems="center"
            spacing={4}
            width="fill-parent"
            overflow="visible">
            <AutoLayout
              height={50} width={50}
              horizontalAlignItems="start"
              verticalAlignItems="center"
              overflow="visible">
              {shadowToken ? (
                <Rectangle
                  height={30} width={30}
                  fill={colors.white}
                  stroke={colors.borderGrey}
                  cornerRadius={15}
                  effect={{
                    type: 'drop-shadow',
                    color: {
                      ...hexToRgbObj(
                        shadowToken.$value.color,
                        RGBType.base1
                      ),
                      a: shadowToken.$value.alpha
                    },
                    offset: {
                      x: shadowToken.$value.offsetX,
                      y: shadowToken.$value.offsetY
                    },
                    blur: shadowToken.$value.blur,
                    spread: shadowToken.$value.spread
                  }} />) : null}
              {blurToken ? (
                <AutoLayout
                  height={30} width={30}
                  fill={colors.white}
                  stroke={colors.borderGrey}
                  cornerRadius={15}
                  horizontalAlignItems="center"
                  verticalAlignItems="center"
                  effect={{
                    type: "layer-blur",
                    blur: blurToken.$value.radius
                  }}>
                  <Text
                    fontFamily={typography.primaryFont}
                    fontSize={14}>
                    Ag
                  </Text>
                </AutoLayout>) : null}
            </AutoLayout>
            <Text
              fontFamily={typography.primaryFont}
              fontWeight="normal"
              fontSize={14}
              fill={colors.textColor}
              width="fill-parent"
              height="hug-contents">
              {token.$extensions["dsys.name"]}
            </Text>
            {shadowToken ? (
              <AutoLayout
                direction="vertical"
                width="hug-contents"
                horizontalAlignItems="end">
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="normal"
                  fontSize={11}
                  horizontalAlignText="right"
                  fill={colors.textColorLightest}
                  width="hug-contents"
                  height="hug-contents">
                  Shadow Effect
                </Text>
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="normal"
                  fontSize={11}
                  horizontalAlignText="right"
                  fill={colors.textColorLightest}
                  width="hug-contents"
                  height="hug-contents">
                  {shadowToken.$value.color} / {
                  shadowToken.$value.offsetX} / {
                  shadowToken.$value.offsetY} / {
                  shadowToken.$value.blur} / {
                  shadowToken.$value.alpha.toFixed(2)}%
                </Text>
              </AutoLayout>
            ) : null}
            {blurToken ? (
              <AutoLayout
                direction="vertical"
                width="hug-contents"
                horizontalAlignItems="end">
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="normal"
                  fontSize={11}
                  horizontalAlignText="right"
                  fill={colors.textColorLightest}
                  width="hug-contents"
                  height="hug-contents">
                  Blur Effect
                </Text>
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="normal"
                  fontSize={11}
                  horizontalAlignText="right"
                  fill={colors.textColorLightest}
                  width="hug-contents"
                  height="hug-contents">
                  radius {blurToken.$value.radius}
                </Text>
              </AutoLayout>
            ) : null}
          </AutoLayout>
          {index < tokens.length-1 ? (
            <Rectangle
              height={1}
              width="fill-parent"
              fill={colors.borderGrey} />
          ) : null}
        </AutoLayout>
      );
    }
  );
}