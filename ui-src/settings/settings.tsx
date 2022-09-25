import React from "react";
import { CoreProps } from "../../shared/types/types";
import DTButton, { DTButtonColor } from "../components/DTButton";
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
        className="settings"
        style={this.props.style || {}}>
        <InputHeader
          label="Token Group" />
        <Input
          className=""
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
        <InputHeader
          label="Global" />
        <Input
          className=""
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
          className=""
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
        <InputHeader
          label="GitHub Deploy" />
        <Input
          className=""
          label="GitHub Username" 
          value={this.props.globalData?.fullName}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                fullName: value,
              });
            }
          }} />
        <Input
          className=""
          label="Repository / NPM Package Name (ex: my-design-tokens)" 
          value={this.props.globalData?.fullName}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                fullName: value,
              });
            }
          }} />
        <Input
          className=""
          label="GitHub Access Token" 
          value={this.props.globalData?.fullName}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                fullName: value,
              });
            }
          }} />
        <DTButton
          label="Validate Deployment"
          color={DTButtonColor.grey}
          icon="target"
          onClick={() => console.log('h9i')}/>
      </div>
    );
  }
}