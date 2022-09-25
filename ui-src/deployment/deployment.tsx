import React from "react";
import { CoreProps } from "../../shared/types/types";
import DTButton, { DTButtonColor } from "../components/DTButton";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import Select from "../components/Select";
import "./deployment.css";
import { validate } from "./github";

interface DeploymentProps extends CoreProps {
  style?: object
}

export default class Deployment extends React.Component<DeploymentProps> {

  constructor(props: DeploymentProps | Readonly<DeploymentProps>) {
    super(props);
  }

  render() { 
    let content = (<div>GitHub Deploy is not set up</div>);
    if (this.props.globalData?.gitHubSettings) {
      
      content = (<>
        {this.renderContent()}
        {this.renderBottomNav()}
      </>);
    }

    return (
      <div
        className="deployment scroll-bar"
        style={this.props.style || {}}>
        <InputHeader
          label="GitHub Deploy"
          linkLabel="How Does This Work?"
          onLinkClick={() => console.log('do something')} />
        {content}
      </div>
    );
  }

  renderContent() {
    if (this.props.globalData?.gitHubSettings.validated) {
      const settings = this.props.globalData?.gitHubSettings;
      const repository = `https://github.com/${settings.username}/${settings.repositoryAndNPMPackageName}`;
      const npmPackage = `https://github.com/${settings.username}/${settings.repositoryAndNPMPackageName}/pkgs/npm/${settings.repositoryAndNPMPackageName}`;

      return (<>
        <Input
          label="Repository" 
          readOnly
          value={repository} />
        <Input
          label="NPM Package (via GitHub)" 
          readOnly
          value={npmPackage} />
        <Input
          label="Version" 
          readOnly
          value={`v${this.props.globalData?.gitHubSettings?.version}`} />
      </>);
    }else{
      return (<>
        <Input
          label="Username" 
          value={this.props.globalData?.gitHubSettings?.username}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                gitHubSettings: {
                  ...this.props.globalData?.gitHubSettings,
                  username: value,
                },
              });
            }
          }} />
        <Input
          label="Repository / NPM Package Name (ex: my-design-tokens)" 
          value={this.props.globalData?.gitHubSettings?.repositoryAndNPMPackageName}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                gitHubSettings: {
                  ...this.props.globalData?.gitHubSettings,
                  repositoryAndNPMPackageName: value,
                },
              });
            }
          }} />
        <Input
          label="Access Token"
          password
          value={this.props.globalData?.gitHubSettings?.accessToken}
          onChange={(value: string) => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                gitHubSettings: {
                  ...this.props.globalData?.gitHubSettings,
                  accessToken: value,
                },
              });
            }
          }} />
      </>);
    }
  }

  renderBottomNav() {
    if (this.props.globalData?.gitHubSettings.validated) {
      return (
        <div className="deployment-nav">
          <Select
            label="Version Increment"
            value={'Minor'} />
          <DTButton
            label="Deploy"
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="publish"
            onClick={() => console.log('publish')}/>
        </div>
      );
    }else{
      return (
        <div className="deployment-nav">
          <DTButton
            label="Validate"
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="target"
            onClick={() => {
              if (this.props.globalData?.gitHubSettings)
                validate(this.props.globalData?.gitHubSettings);
            }}/>
        </div>
      );
    }
  }
}