import { TokenSetType } from "../../shared/enums";
import { defaultDesignSystemModel } from "../../shared/types";
import { changeTokenSetType } from "../actions/modelUpdate";
import { colors } from '../../shared/styles';
import button from "../components/button";

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
      spacing={8}>
      <Text
        fontSize={12}
        fill={colors.textColor}>
        Choose what type of Token set you would like to create.
      </Text>
      {button('Color Set', clickTypeButton( TokenSetType.ColorSet ))}
      {button('Typography Set', clickTypeButton( TokenSetType.TypographySet ))}
      {button('Effects', clickTypeButton( TokenSetType.EffectSet ))}
      {button('Icons', clickTypeButton( TokenSetType.IconSet ))}
      {button('Spacing', clickTypeButton( TokenSetType.Spacing ))}
      {button('Components', clickTypeButton( TokenSetType.ComponentSet ))}
      {button('Layouts', clickTypeButton( TokenSetType.LayoutSet ))}
      {button('Columns Spacing', clickTypeButton( TokenSetType.ColumnLayoutSet ))}
    </AutoLayout>
  );
}

// need to return a function so nodeId can be found
function clickTypeButton(
  tokensetType: TokenSetType
) {
  const nodeId = useWidgetId();

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

  return () => {
    changeTokenSetType(
      tokensetType,
      nodeId,
      false,
      setDesignSystemModel
    );
  }
}
