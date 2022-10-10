import { 
  mergeNames,
  colorContrastAda,
  cleanAndSortTokens,
  defaultTokenGroup,
  DSysToken,
  colors,
  typography,
  validColor,
  getIcon,
  Icons,
  dtColorToCss,
  DTColor,
  stylesToDSysTokenset,
 } from '../../shared/index';
import { paintStyles } from '../actions/getStyles';

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Rectangle,
  SVG,
  useSyncedState,
  useEffect,
} = widget;

function renderAda(color: DTColor, id: string) {
  const ada = colorContrastAda(color);
  if (!ada) return null;

  const results = [];

  if (ada.white.aaaSmallText) {
    results.push(<SVG 
      key={`ada_wt_aaa_${id}`}
      src={getIcon(Icons.adaWhiteaaa)} />);
  }else if (ada.white.aaSmallText) {
    results.push(<SVG key={`ada_wt_aa_${id}`} src={getIcon(Icons.adaWhiteaa)} />);
  }else if (ada.white.aaLargeText) {
    results.push(<SVG key={`ada_wt_AA_${id}`} src={getIcon(Icons.adaWhiteAA)} />);
  }

  if (ada.black.aaaSmallText) {
    results.push(<SVG key={`ada_bk_aaa_${id}`} src={getIcon(Icons.adaBlackaaa)} />);
  }else if (ada.black.aaSmallText) {
    results.push(<SVG key={`ada_bk_aa_${id}`} src={getIcon(Icons.adaBlackaa)} />);
  }else if (ada.black.aaLargeText) {
    results.push(<SVG key={`ada_bk_AA_${id}`} src={getIcon(Icons.adaBlackAA)} />);
  }

  return (
    <AutoLayout
      key={`ada_${id}`}
      direction="vertical"
      width={40}
      horizontalAlignItems="end"
      effect={{
        type: "drop-shadow",
        color: '#aaaaaa77',
        offset: {x: 0, y: 0},
        blur: 8,
      }}
      overflow="visible">
      {results}
    </AutoLayout>
  );
}

export default function colorsSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [colorsInitialized, setColorsInitialized] = useSyncedState(
    'colorsInitialized',
    false
  );

  useEffect(() => {
    if (!colorsInitialized) {
      setColorsInitialized(true);
      return async () => {
        const styles = await paintStyles();
        const stylesTokenGroup = stylesToDSysTokenset(styles, tokenGroup.name);
        if (!stylesTokenGroup) return;
        setTokenGroup({
          ...tokenGroup,
          tokensets: [stylesTokenGroup],
        });
      };
    }
  });

  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  const tokenOutput = tokens.map(
    (tokenInfo, index) => {
    const token = tokenInfo[1] as DSysToken;
    const color = token.$value as DTColor;
    return (
      <AutoLayout
        height="hug-contents"
        direction="vertical"
        width="fill-parent"
        overflow="visible"
        verticalAlignItems="center"
        key={`row_${
          token.$extensions["dsys.name"]}${
          token.$extensions["dsys.index"]
        }`}>
        <AutoLayout
          height={54}
          verticalAlignItems="center"
          spacing={4}
          width="fill-parent"
          overflow="visible">
          <AutoLayout
            direction="horizontal"
            width="fill-parent"
            overflow="visible"
            verticalAlignItems="center"
            spacing={20}>
            <AutoLayout
              width={34}
              height={34}
              fill={dtColorToCss(color)}
              horizontalAlignItems="center"
              verticalAlignItems="center"
              cornerRadius={30}
              effect={{
                type: 'drop-shadow',
                color: '#aaaaaa77',
                offset: {x: 0, y: 0},
                blur: 8,
              }}
            >
              {validColor(color) ? null : (
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="normal"
                  fontSize={10}
                  fill={colors.textColorError}
                  horizontalAlignText="center"
                  width="fill-parent"
                  height="hug-contents">
                  error
                </Text>
              )}
            </AutoLayout>
            <Text
              fontFamily={typography.primaryFont}
              fontWeight="normal"
              fontSize={14}
              fill={colors.textColor}
              width="fill-parent"
              height="hug-contents">
              {mergeNames(
                tokenGroup.name,
                token.$extensions["dsys.name"]
              )}
            </Text>
          </AutoLayout>
          <Text
            fontFamily={typography.monotype}
            fontWeight="light"
            fontSize={12}
            fill={colors.textColor}
            horizontalAlignText="right"
            width="hug-contents"
            height="hug-contents">
            {color.hex} {Math.round(color.alpha * 100)}%
          </Text>
          {renderAda(
            color, 
            `${
              token.$extensions["dsys.name"]}${
              token.$extensions["dsys.index"]
            }`
          )}
        </AutoLayout>
        {index < tokens.length-1 ? (
          <Rectangle
            height={1}
            width="fill-parent"
            fill={colors.borderGrey} />
        ) : null}
      </AutoLayout>);
  });

  if (tokenGroup.name) {
    return (
      <AutoLayout 
        name="base-page"
        height="hug-contents"
        width="fill-parent"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={24}
        padding={{
          top: 0, bottom: 20,
          left: 20, right: 20
        }}
        overflow="visible">
        <AutoLayout 
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={0}
          overflow="visible">
          {tokenOutput}
        </AutoLayout>
      </AutoLayout>
    );
  }else{
    return (
      <AutoLayout 
        name="base-page"
        width="fill-parent"
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="start"
        spacing={16}
        padding={{
          top: 10, bottom: 20,
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
          Tokens Not Found
        </Text>
      </AutoLayout>
    )
  }
}