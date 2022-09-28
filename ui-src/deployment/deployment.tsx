import React from "react";
import { CoreProps } from "../../shared/types/types";
import DTButton, { DTButtonColor } from "../components/DTButton";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import Select from "../components/Select";
import connectToRepoClick from "./connectToRepoClick";
import "./deployment.css";
import deployRepoClick from "./deployRepoClick";
import connectToRepo from "./github/connectToRepo";
import { ResponseStatus } from "./github/types";

interface DeploymentProps extends CoreProps {
  style?: object
}

export default class Deployment extends React.Component<DeploymentProps> {

  constructor(props: DeploymentProps | Readonly<DeploymentProps>) {
    super(props);
    this.state = {
      validateLabel: 'Connect To Repository',
      deployLabel: 'Deploy',
    };
  }

  state: {
    validateLabel: string,
    deployLabel: string,
    error?: string,
    feedback?: string
  };

  

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
    if (this.props.globalData?.gitHubSettings.connected === true) {
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
        <DTButton
          label="Disconnect From Repo"
          color={DTButtonColor.grey}
          style={{width: '100%'}}
          icon="unlink"
          onClick={async () => {
            if (!this.props.globalData) return;
            this.props.updateGlobalData({
              ...this.props.globalData,
              gitHubSettings: {
                ...this.props.globalData.gitHubSettings,
                connected: false,
                version: '0.0.0',
              }
            })
          }}/>
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
    if (this.props.globalData?.gitHubSettings.connected === true) {
      return (
        <div className="deployment-nav">
          {this.state.error ? (
            <div className="deployment-error">
              {this.state.error}
            </div>
          ) : (null)}
          {this.state.feedback ? (
            <div className="deployment-feedback">
              {this.state.feedback}
            </div>
          ) : (null)}
          <Select
            label="Version Increment"
            value={'Minor'} />
          <DTButton
            label={this.state.deployLabel}
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="deploy"
            onClick={async () => {
              deployRepoClick(this);
            }}/>
        </div>
      );
    }else{
      return (
        <div className="deployment-nav">
          {this.state.error ? (
            <div className="deployment-error">
              {this.state.error}
            </div>
          ) : (null)}
          {this.state.feedback ? (
            <div className="deployment-feedback">
              {this.state.feedback}
            </div>
          ) : (null)}
          <DTButton
            label={this.state.validateLabel}
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="target"
            onClick={async () => {
              connectToRepoClick(this);
            }}/>
        </div>
      );
    }
  }
}