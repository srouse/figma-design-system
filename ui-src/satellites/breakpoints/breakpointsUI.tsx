import React from "react";
import "./breakpointsUI.css";
import SatelliteHeaderUI from "../../components/SatelliteHeaderUI";
import { CoreProps } from "../../../shared/types/types";

export default class BreakpointsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite"
        style={this.props.style}>
        <SatelliteHeaderUI
          {...this.props}
           />
        breakpoints
      </div>
    );
  }
}