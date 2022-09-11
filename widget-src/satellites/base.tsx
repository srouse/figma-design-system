import { defaultDesignSystemModel, DesignSystemModel } from "../../types";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState
} = widget;

export default function baseSatellite() {

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

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
      {renderWidgetList(designSystemModel)}
    </AutoLayout>
  );
}

function renderWidgetList(
  designSystemModel: DesignSystemModel
) {
  return designSystemModel.tokensets.map(tokenset => {
    return (
      <Text horizontalAlignText="left"
        fontFamily="Roboto"
        fontWeight="medium"
        fill="#333333"
        key={`list-${tokenset.nodeId}`}>
        {`${tokenset.type} sss`}
      </Text>
    );
  })
}