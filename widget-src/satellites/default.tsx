import { colors, typography } from '../../shared/styles';
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { defaultTokenGroup, TokenGroup } from '../../shared/types/types';
import header from '../components/header';
import { openEditor } from '../actions/baseActions';
import firstRunButton from './firstRun/firstRunButton';
import { Icons } from '../../shared/icons';

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  Rectangle,
} = widget;

export default function defaultSatellite() {

  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  const [, setIsWindowUIOpen] = useSyncedState(
    'isWindowUIOpen',
    false
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
          top: 40, bottom: 20,
          left: 40, right: 40
        }}
        overflow="visible">
        {/* <Text
          fontSize={18}
          fontFamily={typography.primaryFont}
          fontWeight="light"
          fill={colors.textColor}>
          New Token Set
        </Text>*/}
        <AutoLayout
          direction="vertical"
          width="fill-parent"
          padding={{bottom: 30}}>
          <AutoLayout
            direction="horizontal"
            width="fill-parent">
            {firstRunButton(
              'colors', Icons.colors,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.ColorSet, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'typography', Icons.typography,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.TypographySet, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'effects', Icons.effects,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.EffectSet, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'spacing', Icons.spacing,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.Spacing, setIsWindowUIOpen
              ))}
          </AutoLayout>
          <Rectangle
            height={1} width="fill-parent"
            fill={colors.borderGrey} />
          <AutoLayout
            direction="horizontal"
            width="fill-parent">
            {firstRunButton(
              'icons', Icons.icons,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.IconSet, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'components', Icons.component,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.ComponentSet, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'breakpoints', Icons.breakpoint,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.Spacing, setIsWindowUIOpen
              ))}
            <Rectangle
              width={1} height="fill-parent"
              fill={colors.borderGrey} />
            {firstRunButton(
              'custom', Icons.custom,
              () => clickTypeButton(
                tokenGroup, setTokenGroup,
                DSysGroupType.Spacing, setIsWindowUIOpen
              ))}
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

// need to return a function so nodeId can be found
function clickTypeButton(
  tokenGroup: TokenGroup,
  setTokenGroup: (newValue: TokenGroup | ((currValue: TokenGroup) => TokenGroup)) => void,
  tokenGroupType: DSysGroupType,
  setIsWindowUIOpen: (open: boolean) => void
) {
  setTokenGroup({
    ...tokenGroup,
    type: tokenGroupType
  });
  setIsWindowUIOpen(true);
  return openEditor();
}
