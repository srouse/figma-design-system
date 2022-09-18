import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./componentsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface ComponentsUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class ComponentsUI extends React.Component <ComponentsUIProps> {

  constructor(props: ComponentsUIProps | Readonly<ComponentsUIProps>) {
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
        components
      </div>
    );
  }
}