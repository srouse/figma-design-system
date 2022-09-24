import React from "react";
import "./typographyUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class TypographyUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        typography
      </div>
    );
  }
}