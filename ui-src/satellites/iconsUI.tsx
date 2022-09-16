import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import "./iconsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface IconsUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class IconsUI extends React.Component <IconsUIProps> {

  constructor(props: IconsUIProps | Readonly<IconsUIProps>) {
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
        Icons
      </div>
    );
  }
}