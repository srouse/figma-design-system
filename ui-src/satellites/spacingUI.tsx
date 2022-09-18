import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./spacingUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface SpacingUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class SpacingUI extends React.Component <SpacingUIProps> {

  constructor(props: SpacingUIProps | Readonly<SpacingUIProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          tokenset={this.props.tokenset}
          designTokensModel={this.props.designTokensModel}
          sendToWidget={this.props.sendToWidget}
           />
        spacing
      </div>
    );
  }
}