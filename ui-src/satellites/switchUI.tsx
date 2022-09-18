import React from "react";
import { DesignTokensModel, TokenSet, TokenSetType } from "../../shared/types/types";
import BaseUI from "./baseUI";
import ColorsUI from "./colorsUI";
import ColumnLayoutUI from "./columnLayoutUI";
import ComponentsUI from "./componentsUI";
import EffectsUI from "./effectsUI";
import IconsUI from "./iconsUI";
import LayoutUI from "./layoutUI";
import SpacingUI from "./spacingUI";
import "./switchUI.css";
import TypographyUI from "./typographyUI";

interface SwitchProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class SwitchUI extends React.Component <SwitchProps> {

  constructor(props: SwitchProps | Readonly<SwitchProps>) {
    super(props);
  }

  render() { 
    switch (this.props.tokenset?.type) {
      case TokenSetType.Base :
        return (
          <BaseUI
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.ColorSet :
        return (
          <ColorsUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.TypographySet :
        return (
          <TypographyUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.EffectSet :
        return (
          <EffectsUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.IconSet :
        return (
          <IconsUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.ComponentSet :
        return (
          <ComponentsUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.Spacing :
        return (
          <SpacingUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.LayoutSet :
        return (
          <LayoutUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
      case TokenSetType.ColumnLayoutSet :
        return (
          <ColumnLayoutUI
            tokenset={this.props.tokenset}
            designTokensModel={this.props.designTokensModel}
            sendToWidget={this.props.sendToWidget} />
        );
    }
    return ( <div>no token type found</div> );
  }
}