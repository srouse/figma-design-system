import getIcon, { Icons } from '../../../shared/icons';
import { colors, typography } from '../../../shared/styles';
const { widget } = figma;
const {
  AutoLayout,
  Text,
  SVG,
} = widget;

export default function firstRunButton(
  title: string,
  icon: Icons,
  onClick: () => void
) {
  return (
    <AutoLayout
      key={`firstrunbutton-${title}`}
      direction="vertical"
      width="fill-parent"
      verticalAlignItems="center"
      horizontalAlignItems="center"
      padding={{bottom: 14}}
      hoverStyle={{
        fill: colors.hoverBgColorLight
      }}
      onClick={onClick}>
      <AutoLayout
        height={50}
        width="fill-parent"
        direction="vertical"
        verticalAlignItems="center"
        horizontalAlignItems="center">
        <SVG
          width={32}
          height={32}
          src={getIcon(
            icon,
            colors.textColor,
          )}
        />
      </AutoLayout>
      <Text
        fontSize={11}
        fontFamily={typography.primaryFont}
        fontWeight="light"
        fill={colors.textColor}>
        {title.toUpperCase()}
      </Text>
    </AutoLayout>
  );
}

export function firstRunButtonSpacer() {
  return (
    <AutoLayout
      width="fill-parent"
      height={1}>
    </AutoLayout>
  );
}