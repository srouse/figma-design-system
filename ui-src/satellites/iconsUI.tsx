import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./iconsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface IconsUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class IconsUI extends React.Component <IconsUIProps> {

  constructor(props: IconsUIProps | Readonly<IconsUIProps>) {
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
        Icons
      </div>
    );
  }
}