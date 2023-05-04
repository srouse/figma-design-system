import React, { ReactElement } from "react";
import tokenGroupTypeToName from "../../shared/tokenGroupTypeToName";
import { CoreProps } from "../../shared/types/types";
import Input from "../components/input";
import InputHeader from "../components/InputHeader";
import "./settings.css";
import { version } from "../../shared";
import UpdateVersionInstructions from "../utils/UpdateVersionInstructions";
import * as mixpanel from '../utils/mixpanel';
import HelpLink from "../components/HelpLink";

interface SettingsProps extends CoreProps {
  style?: object,
  localSettings?: ReactElement<any, any>
}

export default class Settings extends React.Component<SettingsProps> {

  constructor(props: SettingsProps | Readonly<SettingsProps>) {
    super(props);
    this.state = {
      versionContent: <div className="version">version: {version}</div>,
      versionOutOfDate: false,
    };
    this.compareVersion();
  }

  state: {
    versionContent: JSX.Element,
    versionOutOfDate: boolean
  }

  async compareVersion() {
    const versionResult = await fetch(
      'https://figmadesignsystem.app/.netlify/functions/version'
    )
      .then(response => response.json())
      .catch(error => console.error(error));
    if (versionResult.version !== version) {
      mixpanel.track('version-out-of-date',{
        installed: version,
        latest: versionResult.version
      });
      this.setState({
        versionContent: (
          <div className="version-out-of-date">
            <div className="title">
              Widget out of Date
            </div>
            <div>
              Latest version: {versionResult.version}, your version: {version}
            </div>
            <UpdateVersionInstructions></UpdateVersionInstructions>
          </div>
        ),
        versionOutOfDate: true,
      })
    }
  }

  render() { 
    return (
      <div
        className="settings scroll-bar"
        style={this.props.style || {}}>
        {this.state.versionOutOfDate ? (
          <div>
            {this.state.versionContent}
          </div>
        ) : null}
        {this.props.localSettings ? (<>
          <InputHeader
            label="Token Group" />
          {this.props.localSettings}
          <Input
            label="Token Type" 
            readOnly
            value={
              tokenGroupTypeToName(this.props.tokenGroup)
            } />
        </>) : null}
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
        <HelpLink
          style={{marginBottom: '10px'}}
          content="View Documentation"
          link="https://figmadesignsystem.app/">
        </HelpLink>
        {!this.state.versionOutOfDate ? (
          <div>
            {this.state.versionContent}
          </div>
        ) : null}
      </div>
    );
  }
}