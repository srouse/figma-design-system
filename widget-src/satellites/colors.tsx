import { colors, typography } from "../../shared/styles";

const { widget } = figma;
const {
  AutoLayout,
  Text,
} = widget;

export default function colorsSatellite() {
  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="start"
      spacing={14}
      padding={{top: 0,left: 0,bottom: 0,right: 0}}
      cornerRadius={10}>
      <Text>Colors</Text>
      <Text
        fontFamily={typography.primaryFont}
        fontWeight="medium"
        fontSize={12}
        fill={colors.textColorLighter}>
        todo...
      </Text>
    </AutoLayout>
  );
}