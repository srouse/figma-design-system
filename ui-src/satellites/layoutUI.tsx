import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./layoutUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface LayoutUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class LayoutUI extends React.Component <LayoutUIProps> {

  constructor(props: LayoutUIProps | Readonly<LayoutUIProps>) {
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
        layout
      </div>
    );
  }
}