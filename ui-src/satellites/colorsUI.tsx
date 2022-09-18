import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./colorsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface SwitchProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class ColorsUI extends React.Component <SwitchProps> {

  constructor(props: SwitchProps | Readonly<SwitchProps>) {
    super(props);
  }

  render() { 
    return (
      <div>
        <SatelliteHeaderUI
          tokenset={this.props.tokenset}
          designTokensModel={this.props.designTokensModel}
          sendToWidget={this.props.sendToWidget}
           />
        colors
      </div>
    );
  }
}