import { colors, typography } from "../../shared/styles";
import { DSysToken } from "../../shared/types/designSystemTypes";
import { defaultTokenGroup } from "../../shared/types/types";
import cleanAndSortTokens from '../../shared/utils/cleanAndSortTokens';

const { widget } = figma;
const {
  AutoLayout,
  Text,
  Rectangle,
  Input,
  useSyncedState,
} = widget;

export default function colorsSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);
  const tokenOutput = tokens.map(
    tokenInfo => {
    const token = tokenInfo[1] as DSysToken;
    return (
      <AutoLayout
        height={32}
        verticalAlignItems="center"
        spacing={20}
        width="fill-parent"
        key={
          `${token.$extensions["dsys.name"]}${token.$extensions["dsys.index"]}`
        }
        overflow="visible">
        <Rectangle
          width={26}
          height={26}
          fill={token.$value as string}
          cornerRadius={16}
          effect={{
            type: 'drop-shadow',
            color: '#aaaaaa',
            offset: {x: 0, y: 0},
            blur: 10,
          }}
        ></Rectangle>
        <Text
          fontFamily={typography.primaryFont}
          fontWeight="light"
          fontSize={16}
          fill={colors.textColor}
          height="hug-contents">
          {tokenGroup.name?.toLowerCase() || ''}{
            token.$extensions["dsys.name"] ? 
              `-${token.$extensions["dsys.name"]}` : ''
          }
        </Text>
        <Input
          fontFamily={typography.primaryFont}
          fontWeight="light"
          fontSize={12}
          fill={colors.textColor}
          width={70}
          value={token.$value as string}
          onClick={() => {}}
          onTextEditEnd={() => {}} />
      </AutoLayout>
    );
  });

  if (tokenGroup.name) {
    return (
      <AutoLayout 
        name="base-page"
        height="hug-contents"
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={16}
        padding={{
          top: 0, bottom: 20,
          left: 20, right: 20
        }}
        overflow="visible">
        <AutoLayout 
          height="hug-contents"
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
          horizontalAlignItems="start"
          verticalAlignItems="start"
          spacing={8}
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