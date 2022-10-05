import React from "react";
import tokenGroupTypeToName from "../../shared/tokenGroupTypeToName";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import { CoreProps } from "../../shared/types/types";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import "./settings.css";

interface SettingsProps extends CoreProps {
  style?: object
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
        {this.props.tokenGroup?.type === DSysGroupType.Base
          ? (null) : (<>
            <InputHeader
              label="Token Group" />
            <Input
              label="Name" 
              value={this.props.tokenGroup?.name}
              onChange={(value: string) => {
                if (this.props.tokenGroup) {
                  this.props.updateTokenGroup({
                    ...this.props.tokenGroup,
                    name: value,
                  });
                }
              }} />
              <Input
                label="Token Type" 
                readOnly
                value={tokenGroupTypeToName(this.props.tokenGroup)} />
          </>)}
        <InputHeader
          label="Global" />
        <Input
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
    );
  }
}