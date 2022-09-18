import { defaultDesignTokensModel } from "../../shared/types/types";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState
} = widget;

export default function colorsSatellite() {

  const [designTokensModel, setDesignTokensModel] = useSyncedState(
    'designTokensModel',
    defaultDesignTokensModel
  );

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={14}
      padding={{top: 0,left: 0,bottom: 0,right: 0}}
      cornerRadius={10}>
      <Text>Colors</Text>
    </AutoLayout>
  );
}