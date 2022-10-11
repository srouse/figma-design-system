import { colors } from '../../shared/styles';
import button from "../components/button";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { defaultTokenGroup, TokenGroup } from '../../shared/types/types';
import header from '../components/header';

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
} = widget;

export default function defaultSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start">
      {header()}
      <AutoLayout 
        height="hug-contents"
        direction="vertical"
        width="fill-parent"
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={8}
        padding={{
          top: 20, bottom: 10,
          left: 20, right: 20
        }}
        overflow="visible">
        <Text
          fontSize={12}
          fill={colors.textColor}>
          Choose what type of Token set you would like to create.
        </Text>
        {button(
          'Color Set', 
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.ColorSet ),
        )}
        {button(
          'Typography Set',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.TypographySet ),
        )}
        {button(
          'Effects',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.EffectSet ),
        )}
        {button(
          'Icons',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.IconSet ),
        )}
        {button(
          'Spacing',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.Spacing ),
        )}
        {button(
          'Components',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.ComponentSet ),
        )}
        {button(
          'Layouts',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.LayoutSet ),
        )}
        {button(
          'Columns Spacing',
          () => clickTypeButton( tokenGroup, setTokenGroup, DSysGroupType.ColumnLayoutSet ),
        )}
      </AutoLayout>
    </AutoLayout>
  );
}

// need to return a function so nodeId can be found
function clickTypeButton(
  tokenGroup: TokenGroup,
  setTokenGroup: (newValue: TokenGroup | ((currValue: TokenGroup) => TokenGroup)) => void,
  tokenGroupType: DSysGroupType
) {
  setTokenGroup({
    ...tokenGroup,
    type: tokenGroupType
  })
}
