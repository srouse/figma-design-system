import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import "./componentsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";

interface ComponentsUIProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class ComponentsUI extends React.Component <ComponentsUIProps> {

  constructor(props: ComponentsUIProps | Readonly<ComponentsUIProps>) {
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
        components
      </div>
    );
  }
}