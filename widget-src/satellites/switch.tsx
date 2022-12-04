import {
  defaultTokenGroup,
} from "../../shared/types/types";
import base from "../base/base";
import colorsSatellite from "./colors/colors";
import effectsSatellite from "./effects/effects";
import iconsSatellite from "./icons/icons";
import typographySatellite from "./typography/typography";
import defaultSatellite from "./default";
import spacingSatellite from "./spacing/spacing";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import componentsSatellite from "./component/component";
import breakpointsSatellite from "./breakpoints/breakpoints";
import customSatellite from "./custom/custom";

const { widget } = figma;
const {
  useSyncedState,
} = widget;

export default function satelliteSwitch() {
  const [tokenGroup, ] = useSyncedState(
    'tokenGroup',
    defaultTokenGroup
  );

  switch (tokenGroup.type) {
    case DSysGroupType.Base:
      return base();
    case DSysGroupType.BreakpointSet:
      return breakpointsSatellite();
    case DSysGroupType.ColorSet:
      return colorsSatellite();
    case DSysGroupType.ComponentSet:
      return componentsSatellite();
    case DSysGroupType.CustomSet:
      return customSatellite();
    case DSysGroupType.EffectSet:
      return effectsSatellite();
    case DSysGroupType.IconSet:
      return iconsSatellite();
    case DSysGroupType.Spacing:
      return spacingSatellite();
    case DSysGroupType.TypographySet:
      return typographySatellite();
    default:
      return defaultSatellite();
  }
}