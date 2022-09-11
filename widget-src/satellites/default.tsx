import { TokenSetType } from "../../enums";
import { defaultDesignSystemModel } from "../../types";
import { changeTokenSetType } from "../actions/modelUpdate";

const { widget } = figma;
const {
  AutoLayout,
  Text,
  useSyncedState,
  useWidgetId,
} = widget;

export default function defaultSatellite() {

  

  return (
    <AutoLayout 
      name="base-page"
      height="hug-contents"
      width="fill-parent"
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="start"
      spacing={10}>
      {renderButton('Color Set', TokenSetType.ColorSet)}
      {renderButton('Typography Set', TokenSetType.TypographySet)}
      {renderButton('Effects', TokenSetType.EffectSet)}
      {renderButton('Icons', TokenSetType.IconSet)}
      {renderButton('Spacing', TokenSetType.Spacing)}
      {renderButton('Components', TokenSetType.ComponentSet)}
    </AutoLayout>
  );
}

function renderButton(
  label: string,
  tokenSetType: TokenSetType
) {
  const nodeId = useWidgetId();

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

  return (
    <AutoLayout 
      name="Button Large"
      width="fill-parent"
      height={43}
      direction="horizontal"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      spacing={10}
      padding={{top: 12,left: 163,bottom: 12,right: 163}}
      fill="#018ef4"
      cornerRadius={6}
      onClick={() => {
        changeTokenSetType( tokenSetType, nodeId, false, setDesignSystemModel );
      }}>
      <Text 
        name="Label"
        fontFamily="Inter"
        fontWeight="semi-bold"
        fontSize={16}
        width="hug-contents"
        height="hug-contents"
        fill="#ffffff">
        {label}
      </Text>
    </AutoLayout>
  );
}