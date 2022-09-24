import React from "react";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import BaseUI from "./baseUI";
import ColorsUI from "./colorsUI";
import ColumnLayoutUI from "./columnLayoutUI";
import ComponentsUI from "./componentsUI";
import { CoreProps } from "../../shared/types/types";
import EffectsUI from "./effectsUI";
import IconsUI from "./iconsUI";
import LayoutUI from "./layoutUI";
import SpacingUI from "./spacingUI";
import "./switchUI.css";
import TypographyUI from "./typographyUI";

export default class SwitchUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    if (!this.props.globalData) return '';
    switch (this.props.tokenGroup?.type) {
      case DSysGroupType.Base :
        return (
          <BaseUI {...this.props} />
        );
      case DSysGroupType.ColorSet :
        return (
          <ColorsUI {...this.props} />
        );
      case DSysGroupType.TypographySet :
        return (
          <TypographyUI {...this.props} />
        );
      case DSysGroupType.EffectSet :
        return (
          <EffectsUI {...this.props} />
        );
      case DSysGroupType.IconSet :
        return (
          <IconsUI {...this.props} />
        );
      case DSysGroupType.ComponentSet :
        return (
          <ComponentsUI {...this.props} />
        );
      case DSysGroupType.Spacing :
        return (
          <SpacingUI {...this.props} />
        );
      case DSysGroupType.LayoutSet :
        return (
          <LayoutUI {...this.props} />
        );
      case DSysGroupType.ColumnLayoutSet :
        return (
          <ColumnLayoutUI {...this.props} />
        );
    }
    return ( <div>no token type found</div> );
  }
}