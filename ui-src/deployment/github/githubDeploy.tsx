import React from "react";
import {
  Icons,
  CoreProps,
} from "../../../shared";
import DTButton, {
  DTButtonColor,
} from "../../components/DTButton";
import Input from "../../components/input";
import InputHeader from "../../components/InputHeader";
import Select from "../../components/Select";
import "./githubDeploy.css";
import { VersionIncrements } from "./types";
import DeployModal, { DeploymentModalActions } from "./modal/deployModal";
import HelpLink from "../../components/HelpLink";

interface GitHubDeployProps extends CoreProps {}

export default class GitHubDeploy extends React.Component<GitHubDeployProps> {

  constructor(props: GitHubDeployProps | Readonly<GitHubDeployProps>) {
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
        className="github-deploy scroll-bar">
        {/* <InputHeader
          label="GitHub Deploy" /> */}
        {/* <InputHeader
          label="GitHub Deploy"
          linkLabel="TESTING 2"
          onLinkClick={async () => {
            // ======= TESTING =================================================
            // testing button is in header (and commented out in InputHeader)
            console.clear();

            const gitHubSettings = this.props.globalData?.gitHubSettings;
            if (!gitHubSettings) return;

            const tokensResult: any = await postMessagePromise(
              MessageRequest.getFinalTokens
            );

            const fileCreateResults: FileCreateResults = {
              tokenResults: tokensResult.designTokenResults,
            }

            console.log('tokensResult', tokensResult);
      
            // Javascript
            const javascriptVarsResults = await javascriptVarsTransformation(
              fileCreateResults
            );

            console.log('javascriptVarsResults', javascriptVarsResults);

            const cssVarsResults = await variablesTransformation(
              fileCreateResults
            );

            console.log('cssVarsResults', cssVarsResults);

            /*
            // VARS
            const cssVarsResults = await variablesTransformation(
              fileCreateResults
            );

            const scssVarsResults = await variablesTransformation(
              fileCreateResults, true
            );

            // TYPINGS
            const cssTypingsResult = await cssVariablesTypingsTransformation(
              fileCreateResults
            );

            // COMPONENT SCSS
            await CompScssFiles.upload(
              gitHubSettings,
              () => {},
              fileCreateResults,
            )* /

            // console.log('fileCreateResults', fileCreateResults);

            /*
            if (!this.props.globalData) return;
            this.props.updateGlobalData({
              ...this.props.globalData,
              gitHubSettings: {
                ...this.props.globalData.gitHubSettings,
                connected: false,
                deployed: false,
                version: '0.0.0',
              }
            });* /
            // ======= END TESTING =============================================
          }} />*/}
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
    const settings = this.props.globalData?.gitHubSettings;
    if (!settings) {
      return (<div>no settings found</div>);
    }
    if (settings.connected === true) {
      const repository = `https://github.com/${settings.username}/${settings.repositoryAndNPMPackageName}`;
      const npmPackage = settings.deployed ? 
        `https://github.com/${settings.username}/${settings.repositoryAndNPMPackageName}/pkgs/npm/${settings.repositoryAndNPMPackageName}`
        : 'Not Deployed';
      const versionStr = settings.deployed ? `v${settings.version}` : 'Not Deployed';
      return (<>
        <Input
          label="Repository" 
          readOnly
          value={repository}
          href={repository} />
        <Input
          label="NPM Package (via GitHub)" 
          readOnly
          value={npmPackage}
          href={settings.deployed ? npmPackage : ''} />
        <Input
          label="Version" 
          readOnly
          value={versionStr} />
        <DTButton
          label="Detach"
          color={DTButtonColor.grey}
          style={{width: '100%'}}
          icon={Icons.edit}
          onClick={async () => {
            if (this.props.globalData) {
              this.props.updateGlobalData({
                ...this.props.globalData,
                gitHubSettings: {
                  ...this.props.globalData?.gitHubSettings,
                  connected: false,
                  deployed: false,
                },
              });
            }
          }}/>
        <HelpLink
          style={{marginTop: '10px'}}
          content="How does GitHub deploy work?"
          link="https://figmadesignsystem.app/#deployment---github-npm-packages">
        </HelpLink>
      </>);
    }else{
      return (<>
        <Input
          label="Username" 
          value={settings.username}
          onEnterOrBlur={(value: string) => {
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
          value={settings.repositoryAndNPMPackageName}
          onEnterOrBlur={(value: string) => {
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
          type="password"
          value={settings.accessToken}
          onEnterOrBlur={(value: string) => {
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
        <HelpLink
          style={{marginTop: '10px'}}
          content="How does GitHub deploy work?"
          link="https://figmadesignsystem.app/#deployment---github-npm-packages">
        </HelpLink>
      </>);
    }
  }

  renderBottomNav() {
    if (this.props.globalData?.gitHubSettings.connected === true) {
      return (
        <div className="github-deploy-nav">
          {this.state.error ? (
            <div className="github-deploy-error">
              {this.state.error}
            </div>
          ) : (null)}
          {this.state.feedback ? (
            <div className="github-deploy-feedback">
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
            color={DTButtonColor.primary}
            style={{width: '100%'}}
            icon={Icons.deploy}
            onClick={async () => {
              this.setState({
                modalAction: DeploymentModalActions.deploy,
              });
            }}/>
        </div>
      );
    }else{
      return (
        <div className="github-deploy-nav">
          {this.state.error ? (
            <div className="github-deploy-error">
              {this.state.error}
            </div>
          ) : (null)}
          {this.state.feedback ? (
            <div className="github-deploy-feedback">
              {this.state.feedback}
            </div>
          ) : (null)}
          <DTButton
            label="Connect To Repository"
            color={DTButtonColor.grey}
            style={{width: '100%'}}
            icon={Icons.target}
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