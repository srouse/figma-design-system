import React from "react";
import "./baseUI.css";
import Input from "../components/input";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import { CoreProps } from "../../shared/types/types";

export default class BaseUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="base satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        <div className="editor-header">
          <Input
            className="base-prefix"
            label="Prefix" 
            value={this.props.globalData?.prefix} 
            onChange={(value: string) => {
              if (this.props.globalData) {
                this.props.updateGlobalData({
                  ...this.props.globalData,
                  prefix: value,
                });
              }
            }} />
          <Input
            className="base-full-name"
            label="Full Name" 
            value={this.props.globalData?.fullName} 
            onChange={(value: string) => {
              if (this.props.globalData) {
                this.props.updateGlobalData({
                  ...this.props.globalData,
                  fullName: value,
                });
              }
            }} />
          </div>
      </div>
    );
  }
}