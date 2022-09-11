import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types";
import "./spacingUI.css";
import SatelliteHeaderUI from "./satelliteHeaderUI";

interface SpacingUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class SpacingUI extends React.Component <SpacingUIProps> {

  constructor(props: SpacingUIProps | Readonly<SpacingUIProps>) {
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
        spacing
      </div>
    );
  }
}