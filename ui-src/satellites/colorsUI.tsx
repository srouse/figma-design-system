import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import "./colorsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface SwitchProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
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
          designSystemModel={this.props.designSystemModel}
          sendToWidget={this.props.sendToWidget}
           />
        colors
      </div>
    );
  }
}