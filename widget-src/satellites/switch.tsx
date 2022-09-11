import { TokenSetType } from "../../shared/enums";
import { defaultDesignSystemModel, TokenSet } from "../../shared/types";
import baseSatellite from "./base";
import colorsSatellite from "./colors";
import componentsSatellite from "./components";
import effectsSatellite from "./effects";
import iconsSatellite from "./icons";
import typographySatellite from "./typography";
import defaultSatellite from "./default";
import spacingSatellite from "./spacing";
import layoutSatellite from "./layout";
import columnLayoutSatellite from "./columnLayout";

const { widget } = figma;
const {
  Text,
  useSyncedState,
  useWidgetId
} = widget;

export default function satelliteSwitch(tokenset: TokenSet | undefined) {
  const nodeId = useWidgetId();

  const [designSystemModel, setDesignSystemModel] = useSyncedState(
    'designSystemModel',
    defaultDesignSystemModel
  );

  if (!tokenset) {
    return (
      <Text
        fill="#aaaaaa">
        processing
      </Text>
    );
  }

  switch (tokenset.type) {
    case TokenSetType.Base:
      return baseSatellite();
    case TokenSetType.ColorSet:
      return colorsSatellite();
    case TokenSetType.TypographySet:
      return typographySatellite();
    case TokenSetType.IconSet:
      return iconsSatellite();
    case TokenSetType.EffectSet:
      return effectsSatellite();
    case TokenSetType.ComponentSet:
      return componentsSatellite();
    case TokenSetType.Spacing:
      return spacingSatellite();
    case TokenSetType.LayoutSet:
      return layoutSatellite();
    case TokenSetType.ColumnLayoutSet:
      return columnLayoutSatellite();
    default:
      return defaultSatellite();
  }
}