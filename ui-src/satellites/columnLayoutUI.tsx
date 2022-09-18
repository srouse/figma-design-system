import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./columnLayoutUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface ColumnLayoutUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class ColumnLayoutUI extends React.Component <ColumnLayoutUIProps> {

  constructor(props: ColumnLayoutUIProps | Readonly<ColumnLayoutUIProps>) {
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
        column layout
      </div>
    );
  }
}