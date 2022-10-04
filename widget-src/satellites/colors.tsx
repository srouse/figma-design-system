import { colors, typography } from "../../shared/styles";
import { DSysToken } from "../../shared/types/designSystemTypes";
import { defaultTokenGroup } from "../../shared/types/types";
import cleanAndSortTokens from '../../shared/utils/cleanAndSortTokens';
import colorContrastAda from '../../shared/utils/adaCompliance';
import adaIcons from "./adaIcons";
import validColor, { returnValidColor } from '../../shared/utils/validColor';

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Rectangle,
  Input,
  SVG,
  useSyncedState,
} = widget;

function renderAda(color: string, id: string) {
  const ada = colorContrastAda(color);
  if (!ada) return null;

  const results = [];

  if (ada.white.aaaSmallText) {
    results.push(<SVG key={`ada_wt_aaa_${id}`} src={adaIcons.white.aaa} />);
  }else if (ada.white.aaSmallText) {
    results.push(<SVG key={`ada_wt_aa_${id}`} src={adaIcons.white.aa} />);
  }else if (ada.white.aaLargeText) {
    results.push(<SVG key={`ada_wt_AA_${id}`} src={adaIcons.white.AA} />);
  }

  if (ada.black.aaaSmallText) {
    results.push(<SVG key={`ada_bk_aaa_${id}`} src={adaIcons.black.aaa} />);
  }else if (ada.black.aaSmallText) {
    results.push(<SVG key={`ada_bk_aa_${id}`} src={adaIcons.black.aa} />);
  }else if (ada.black.aaLargeText) {
    results.push(<SVG key={`ada_bk_AA_${id}`} src={adaIcons.black.AA} />);
  }

  return (
    <AutoLayout
      key={`ada_${id}`}
      direction="vertical"
      width={40}
      horizontalAlignItems="end"
      spacing={2}>
      {results}
    </AutoLayout>
  );
}

export default function colorsSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  const tokenOutput = tokens.map(
    (tokenInfo, index) => {
    const token = tokenInfo[1] as DSysToken;
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
          height={48}
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
              width={26}
              height={26}
              fill={returnValidColor(token.$value as string)}
              horizontalAlignItems="center"
              verticalAlignItems="center"
              cornerRadius={16}
              effect={{
                type: 'drop-shadow',
                color: '#aaaaaa',
                offset: {x: 0, y: 0},
                blur: 10,
              }}
            >
              {validColor(token.$value as string) ? null : (
                <Text
                  fontFamily={typography.primaryFont}
                  fontWeight="bold"
                  fontSize={12}
                  fill={colors.textColorError}
                  horizontalAlignText="center"
                  width="fill-parent"
                  height="hug-contents">
                  !!
                </Text>
              )}
            </AutoLayout>
            <Text
              fontFamily={typography.primaryFont}
              fontWeight="semi-bold"
              fontSize={16}
              fill={colors.textColor}
              width="fill-parent"
              height="hug-contents">
              {token.$extensions["dsys.name"]}
            </Text>
          </AutoLayout>
          <Text
            fontFamily={typography.primaryFont}
            fontWeight="light"
            fontSize={13}
            fill={colors.textColor}
            horizontalAlignText="right"
            width="fill-parent"
            height="hug-contents">
            {token.$value as string}
          </Text>
          {renderAda(
            token.$value as string, 
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
          width="fill-parent"
          direction="vertical"
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={4}
          overflow="visible">
          <Text
            fontFamily={typography.primaryFont}
            fontWeight="light"
            fontSize={22}
            fill={colors.textColor}>
            {tokenGroup.name}
          </Text>
        </AutoLayout>
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