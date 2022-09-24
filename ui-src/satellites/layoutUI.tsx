import React from "react";
import "./layoutUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class LayoutUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        layout
      </div>
    );
  }
}