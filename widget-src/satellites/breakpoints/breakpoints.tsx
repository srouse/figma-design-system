import {
  cleanAndSortTokens,
  defaultTokenGroup,
  TokenGroup,
  DSysBreakpointToken,
  colors,
  typography,
} from "../../../shared/index";
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

export default function breakpointsSatellite() {
  // const nodeId = useWidgetId();

  const [tokenGroup, ] = useSyncedState(
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

  const breakpointList = renderList(tokenGroup);

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
        {breakpointList && breakpointList.length ? (
          <AutoLayout
            height="hug-contents"
            width="fill-parent"
            direction="horizontal"
            padding={{
              top: 0,left: 40,
              bottom: 20,right: 40
            }}
            spacing={20}>
            <AutoLayout
              width="fill-parent"
              height="hug-contents"
              direction="vertical"
              spacing={4}>
              {breakpointList}
            </AutoLayout>
          </AutoLayout>
        ) : (
          <AutoLayout 
            height="hug-contents"
            direction="vertical"
            width="fill-parent"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={0}
            padding={{
              top: 10, bottom: 30,
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
              No Breakpoint Tokens
            </Text>
          </AutoLayout>
        )}
      </AutoLayout>
  );
}

function renderList(
  tokenGroup: TokenGroup
) {
  const tokenset = tokenGroup.tokensets[0];
  const tokens = cleanAndSortTokens(tokenset);

  const sizes = tokens.map(
    (tokenInfo, index) => {
      const token = tokenInfo[1] as DSysBreakpointToken;
      const value = token.$value;
      const direction = token.$direction;
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
              width={60}
              fontFamily={typography.monotype}
              fontSize={14}
              horizontalAlignText="right"
              fill={colors.textColor}>
              {direction}
            </Text>
            <Text
              width={60}
              fontFamily={typography.monotype}
              fontWeight="light"
              horizontalAlignText="right"
              fontSize={12}
              fill={colors.textColor}>
              {value}
            </Text>
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
