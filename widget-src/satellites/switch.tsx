import { TokenSetType } from "../../enums";
import { defaultDesignSystemModel, TokenSet } from "../../types";
import baseSatellite from "./base";
import colorsSatellite from "./colors";
import componentsSatellite from "./components";
import effectsSatellite from "./effects";
import iconsSatellite from "./icons";
import typographySatellite from "./typography";
import defaultSatellite from "./default";

const { widget } = figma;
const {
  AutoLayout,
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
    default:
      // return <Text>Type Not Found</Text>;
      return defaultSatellite();
  }
}