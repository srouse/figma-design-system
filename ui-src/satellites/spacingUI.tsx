import React from "react";
import "./spacingUI.css";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class SpacingUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        spacing
      </div>
    );
  }
}