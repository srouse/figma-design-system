import React from "react";
import "./columnLayoutUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class ColumnLayoutUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          tokenGroup={this.props.tokenGroup}
          globalData={this.props.globalData}
          updateGlobalData={this.props.updateGlobalData}
          updateTokenGroup={this.props.updateTokenGroup}
           />
        column layout
      </div>
    );
  }
}