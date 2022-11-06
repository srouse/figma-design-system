import { cleanAndSortTokens, colors, defaultTokenGroup, DSysDimensionToken, DSysSpacingTokenset, DSysToken, TokenGroup, typography } from "../../../shared/index";
import header from "../../components/header";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Rectangle,
  useSyncedState,
} = widget;

export default function spacingSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const spacingSizeList = renderSizes(tokenGroup);

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={0}
      overflow="visible">
      {header(
        () => {
          // setEffectsInitialized(false);
        },
      )}
      {spacingSizeList ? (
        <AutoLayout
          height="hug-contents"
          width="fill-parent"
          direction="horizontal"
          padding={{
            top: 40,left: 40,
            bottom: 20,right: 40
          }}
          spacing={20}>
          <AutoLayout
            width="fill-parent"
            height="hug-contents"
            direction="vertical"
            spacing={4}>
            {spacingSizeList}
          </AutoLayout>
        </AutoLayout>
      )
       : (
        <Text
          fontFamily={typography.primaryFont}
          fontWeight="light"
          fontSize={18}
          width="hug-contents"
          horizontalAlignText="center"
          fill={colors.textColorLightest}>
          Spacing Tokens Not Found
        </Text>
      )}
    </AutoLayout>
  );
}

function renderSizes(
  tokenGroup: TokenGroup
) {
  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  const MAX_SIZE = 160;

  let biggestSize = 0;
  tokens.map(tokenInfo => {
    const token = tokenInfo[1] as DSysDimensionToken;
    biggestSize = Math.max(biggestSize, parseFloat(token.$value) );
  })

  biggestSize = Math.min(MAX_SIZE, biggestSize);

  const sizes = tokens.map(
    (tokenInfo, index) => {
      const token = tokenInfo[1] as DSysDimensionToken;
      const size = Math.min(MAX_SIZE, Math.max(1, parseFloat(token.$value)));
      return (
        <AutoLayout
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          overflow="visible"
          verticalAlignItems="center"
          spacing={0}
          key={`row_size_${
            token.$extensions['dsys.uid']
          }`}>
          <AutoLayout
            direction="horizontal"
            spacing={20}
            width="fill-parent"
            verticalAlignItems="center"
            padding={{
              top: 8, bottom: 8,
              left: 0, right: 0,
            }}>
            <Text
              width="fill-parent"
              fontFamily={typography.primaryFont}
              fontSize={14}
              fill={colors.textColor}>
              {`${token.$extensions["dsys.name"]}`}
            </Text>
            <Text
              width={40}
              fontFamily={typography.monotype}
              fontWeight="light"
              horizontalAlignText="right"
              fontSize={12}
              fill={colors.textColor}>
              {`${sizeToString(token.$value)}`}
            </Text>
            <AutoLayout
              width={biggestSize}
              horizontalAlignItems="start">
              <Rectangle
                height={size}
                width={size}
                opacity={size > 1 ? 1 : 0}
                fill={colors.errorLightest} />
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
  return sizes;
}


function sizeToString(size: string) {
  const num = `${Math.round(parseFloat(size)*100)*.01}`;
  if (num.length >=6 ) {
    return parseFloat(num).toFixed(2);
  }
  return num;
}