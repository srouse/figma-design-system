import React from "react";
import "./componentsUI.css";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class ComponentsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        components
      </div>
    );
  }
}