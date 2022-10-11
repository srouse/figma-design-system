import header from "../components/header";

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
        horizontalAlignItems="start"
        verticalAlignItems="start"
        spacing={0}
        padding={{
          top: 0, bottom: 10,
          left: 20, right: 20
        }}
        overflow="visible">
        <Text>Typography</Text>
      </AutoLayout>
    </AutoLayout>
  );
}