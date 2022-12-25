import getIcon, { Icons } from '../../../shared/icons';
import { colors, typography } from '../../../shared/styles';
const { widget } = figma;
const {
  AutoLayout,
  Text,
  SVG,
  Rectangle,
} = widget;

export default function baseCategoryHeader(
  title: string,
  icon: Icons,
) {
  return (
    <AutoLayout
      key={`base-category-header-${title}`}
      direction="horizontal"
      width="fill-parent"
      horizontalAlignItems="start"
      verticalAlignItems="center"
      padding={{bottom: 4}}>
      <SVG
        width={20}
        height={20}
        src={getIcon(
          icon,
          colors.textColor,
        )}
      />
      <Rectangle
        width={14}
        height="fill-parent" />
      <Text
        width="fill-parent"
        fontSize={15}
        fontFamily={typography.primaryFont}
        fontWeight="light"
        horizontalAlignText="left"
        fill={colors.textColor}>
        {title.toUpperCase()}
      </Text>
    </AutoLayout>
  );
}
