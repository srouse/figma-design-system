import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types";
import "./columnLayoutUI.css";
import SatelliteHeaderUI from "./satelliteHeaderUI";

interface ColumnLayoutUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class ColumnLayoutUI extends React.Component <ColumnLayoutUIProps> {

  constructor(props: ColumnLayoutUIProps | Readonly<ColumnLayoutUIProps>) {
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
        column layout
      </div>
    );
  }
}