import React, { ReactElement } from "react";
import tokenGroupTypeToName from "../../shared/tokenGroupTypeToName";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { CoreProps } from "../../shared/types/types";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import "./settings.css";

interface SettingsProps extends CoreProps {
  style?: object,
  localSettings?: ReactElement<any, any>
}

export default class Settings extends React.Component<SettingsProps> {

  constructor(props: SettingsProps | Readonly<SettingsProps>) {
    super(props);
  }

  render() { 
    return (
      <div
        className="settings scroll-bar"
        style={this.props.style || {}}>
        <InputHeader
          label="Token Group" />
        {this.props.tokenGroup?.type === DSysGroupType.Base
          ? (null) : 
          this.props.localSettings ? this.props.localSettings : null}
        <Input
          label="Token Type" 
          readOnly
          value={
            tokenGroupTypeToName(this.props.tokenGroup)
          } />
        <InputHeader
          label="Global" />
        <Input
          label="Prefix" 
          value={this.props.globalData?.prefix}
          onEnterOrBlur={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                prefix: value,
              });
            }
          }} />
        <Input
          label="Full Name" 
          value={this.props.globalData?.fullName}
          onEnterOrBlur={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                fullName: value,
              });
            }
          }} />
      </div>
    );
  }
}