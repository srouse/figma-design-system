import {
  defaultTokenGroup,
  cleanAndSortTokens,
  TokenGroup,
  DSysTypographyToken
} from "../../../shared/index";
import {
  colors,
  typography
} from "../../../shared/styles";
import header from "../../components/header";
import { pullTokensFromTextStyles } from "./typographyUtils";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useWidgetId,
  useSyncedState,
  useEffect,
  Rectangle,
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

  const typographyList = getTypographyList(tokenGroup);

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
          {typographyList ? typographyList : (
            <Text
              fontFamily={typography.primaryFont}
              fontWeight="light"
              fontSize={18}
              width="hug-contents"
              horizontalAlignText="center"
              fill={colors.textColorLightest}>
              Typography Tokens Not Found
            </Text>
          )}
        </AutoLayout>
      </AutoLayout>
  );
}

function getExampleType(token: DSysTypographyToken) {
  // need to protect entries from failures...
  return (
    <Text
      fontFamily={token.$value.fontFamily}
      fontWeight={token.$value.fontWeight as any}
      fontSize={Math.min( token.$value.fontSize, 32 )}
      italic={token.$value.fontStyle === 'italic'}
      textCase={(token.$value.textCase as any).toLowerCase()}
      textDecoration={(token.$value.textDecoration as any).toLowerCase()}
      fill={colors.textColor}
      width="fill-parent"
      height="hug-contents">
      Ag
    </Text>
  );
}

function getTypographyList(
  tokenGroup: TokenGroup
) {
  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  if (!tokens) return false;
  return tokens.map(
    (tokenInfo, index) => {
      const token = tokenInfo[1] as DSysTypographyToken;
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
              {getExampleType(token)}
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
                {token.$value.figmaFontObj.family} {token.$value.figmaFontObj.style}
              </Text>
              <Text
                fontFamily={typography.primaryFont}
                fontWeight="normal"
                fontSize={11}
                horizontalAlignText="right"
                fill={colors.textColorLightest}
                width="hug-contents"
                height="hug-contents">
                {token.$value.fontSize} / {token.$value.lineHeight.unit}
              </Text>
            </AutoLayout>
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