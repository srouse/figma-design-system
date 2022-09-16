import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import "./layoutUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface LayoutUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class LayoutUI extends React.Component <LayoutUIProps> {

  constructor(props: LayoutUIProps | Readonly<LayoutUIProps>) {
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
        layout
      </div>
    );
  }
}