import React from "react";
import { CoreProps } from "../../shared/types/types";
import DTButton, { DTButtonColor } from "../components/DTButton";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import Select from "../components/Select";
import "./deployment.css";
import { VersionIncrements } from "./github/types";
import DeployModal, { DeploymentModalActions } from "./modal/deployModal";

interface DeploymentProps extends CoreProps {
  style?: object
}

export default class Deployment extends React.Component<DeploymentProps> {

  constructor(props: DeploymentProps | Readonly<DeploymentProps>) {
    super(props);
    this.state = {
      modalAction: DeploymentModalActions.closed,
      versionLevel: VersionIncrements.patch,
    };
  }

  state: {
    error?: string,
    feedback?: string,
    modalAction: DeploymentModalActions,
    versionLevel: VersionIncrements,
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
        {this.state.modalAction !== DeploymentModalActions.closed ? (
          <DeployModal 
            {...this.props}
            action={this.state.modalAction}
            versionIncrement={this.state.versionLevel}
            onClose={() => {
              this.setState({
                modalAction: DeploymentModalActions.closed,
              });
            }} />
        ) : null}
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
          label="Detach"
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
            value={this.state.versionLevel}
            onChange={(value: string) => {
              this.setState({
                versionLevel: value,
              })
            }}
            dropdown={[
              {name: 'Major', value: VersionIncrements.major},
              {name: 'Minor', value: VersionIncrements.minor},
              {name: 'Patch', value: VersionIncrements.patch},
            ]} />
          <DTButton
            label="Deploy"
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="deploy"
            onClick={async () => {
              this.setState({
                modalAction: DeploymentModalActions.deploy,
              });
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
            label="Connect To Repository"
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon="target"
            onClick={async () => {
              this.setState({
                modalAction: DeploymentModalActions.connect,
              });
            }}/>
        </div>
      );
    }
  }
}