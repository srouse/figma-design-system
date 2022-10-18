import { colors, typography } from "../../../shared/styles";
import header from "../../components/header";

const { widget } = figma;
const {
  AutoLayout,
  Text,
} = widget;

export default function typographySatellite() {
  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={14}
      padding={{top: 0,left: 0,bottom: 0,right: 0}}
      cornerRadius={10}>
      {header()}
      <AutoLayout 
          height="hug-contents"
          direction="vertical"
          width="fill-parent"
          horizontalAlignItems="center"
          verticalAlignItems="center"
          spacing={0}
          padding={{
            top: 20, bottom: 20,
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
            Typography Tokens Not Found
          </Text>
        </AutoLayout>
    </AutoLayout>
  );
}