import React from "react";
import "./iconsUI.css";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class IconsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        Icons
      </div>
    );
  }
}