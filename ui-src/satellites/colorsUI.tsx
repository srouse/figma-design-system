import React from "react";
import "./colorsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div>
        <SatelliteHeaderUI
          {...this.props}
           />
        colors
      </div>
    );
  }
}