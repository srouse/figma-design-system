import {
  defaultTokenGroup,
} from "../../shared/types/types";
import base from "../base/base";
import colorsSatellite from "./colors";
import componentsSatellite from "./components";
import effectsSatellite from "./effects";
import iconsSatellite from "./icons";
import typographySatellite from "./typography";
import defaultSatellite from "./default";
import spacingSatellite from "./spacing";
import layoutSatellite from "./layout";
import columnLayoutSatellite from "./columnLayout";
import { DSysGroupType } from "../../shared/types/designSystemTypes";

const { widget } = figma;
const {
  useSyncedState,
} = widget;

export default function satelliteSwitch() {
  const [tokenGroup, setTokenGroup] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  switch (tokenGroup.type) {
    case DSysGroupType.Base:
      return base();
    case DSysGroupType.ColorSet:
      return colorsSatellite();
    case DSysGroupType.TypographySet:
      return typographySatellite();
    case DSysGroupType.IconSet:
      return iconsSatellite();
    case DSysGroupType.EffectSet:
      return effectsSatellite();
    case DSysGroupType.ComponentSet:
      return componentsSatellite();
    case DSysGroupType.Spacing:
      return spacingSatellite();
    case DSysGroupType.LayoutSet:
      return layoutSatellite();
    case DSysGroupType.ColumnLayoutSet:
      return columnLayoutSatellite();
    default:
      return defaultSatellite();
  }
}