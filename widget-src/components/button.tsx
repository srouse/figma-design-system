import { colors, typography } from "../../shared/styles";

const { widget } = figma;
const {
  AutoLayout,
  Text,
} = widget;

export default function button(
  label: string,
  onClick: () => void
) {
  return (
    <AutoLayout 
      name="Button Large"
      width="fill-parent"
      height={40}
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      fill={colors.primary}
      cornerRadius={6}
      onClick={onClick}>
      <Text 
        name="Label"
        fontFamily={typography.primaryFont}
        fontWeight="semi-bold"
        fontSize={14}
        width="hug-contents"
        height="hug-contents"
        fill={colors.textColorWhite}>
        {label}
      </Text>
    </AutoLayout>
  );
}