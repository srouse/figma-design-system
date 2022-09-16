import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import "./effectsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface EffectsUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class EffectsUI extends React.Component <EffectsUIProps> {

  constructor(props: EffectsUIProps | Readonly<EffectsUIProps>) {
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
        effects
      </div>
    );
  }
}