import React from "react";
import {
  Icons,
  CoreProps,
  MessageRequest,
  FileCreateResults,
  DSysSheetGroupNames,
} from "../../shared";
import DTButton, {
  DTButtonColor,
} from "../components/DTButton";
import Input from "../components/Input";
import InputHeader from "../components/InputHeader";
import Select from "../components/Select";
import postMessagePromise from "../utils/postMessagePromise";
import "./deployment.css";
import cssAtomsTransformation from "./github/files/transformations/fdst-web/utils/cssAtomsTransformation";
import cssAtomsTypingsTransformation from "./github/files/transformations/fdst-web/utils/cssAtomsTypingsTransformation";
// import cssAtomsTransformation from "./github/actions/transformations/cssAtomsTransformation";
import variablesTransformation from "./github/files/transformations/fdst-web/utils/variablesTransformation";
import cssVariablesTypingsTransformation from "./github/files/transformations/fdst-web/utils/cssVariablesTypingsTransformation";
import cssFontsTransformation from "./github/files/transformations/fdst-web/utils/cssFontsTransformation";
import { VersionIncrements } from "./github/types";
import DeployModal, { DeploymentModalActions } from "./modal/deployModal";
import scssMixinsTransformation from "./github/files/transformations/fdst-web/utils/scssMixinsTransformation";
import CompScssFiles from "./github/files/transformations/fdst-web/componentScss/CompScssFiles";

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
          linkLabel="TESTING 2"
          onLinkClick={async () => {
            console.clear();

            const gitHubSettings = this.props.globalData?.gitHubSettings;
            if (!gitHubSettings) return;

            const tokensResult: any = await postMessagePromise(
              MessageRequest.getFinalTokens
            );
            const fileCreateResults: FileCreateResults = {
              tokenResults: tokensResult.designTokenResults,
            }

            // VARS
            const cssVarsResults = await variablesTransformation(
              fileCreateResults
            );
            console.log('cssVarsResults', cssVarsResults);

            const scssVarsResults = await variablesTransformation(
              fileCreateResults, true
            );
            console.log('scssVarsResults', scssVarsResults);
            
            // TYPINGS
            const cssTypingsResult = await cssVariablesTypingsTransformation(
              fileCreateResults
            );
            console.log('cssTypingsResult', cssTypingsResult);
            
            console.log('TEST');
            // COMPONENT SCSS
            await CompScssFiles.upload(
              gitHubSettings,
              () => {},
              fileCreateResults,
            )



            // ATOMS / MIXINS
            /*const cssAtomsResults = await cssAtomsTransformation(
              fileCreateResults
            );
            console.log('cssAtomsResults', cssAtomsResults);
  
            const scssMixinsResults = await scssMixinsTransformation(
              fileCreateResults, DSysSheetGroupNames.color
            );
            console.log('scssMixinsResults', scssMixinsResults);
            */

            
            
            /*
            const cssAtomTypingsResults = await cssAtomsTypingsTransformation(
              fileCreateResults
            );
            console.log('cssAtomTypingsResults', cssAtomTypingsResults);
            */

            /*
            const fontsResults = await cssFontsTransformation(
              fileCreateResults
            );
            console.log('fontsResults', fontsResults);
            */

            console.log('fileCreateResults', fileCreateResults);

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
            });*/
          }} />
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