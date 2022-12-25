import React from "react";
import { CoreProps } from "../../../shared/types/types";
import DTButton from "../../components/DTButton";
import connectToRepoClick from "../connectToRepoClick";
import deployRepoClick from "../deployRepoClick";
import { VersionIncrements } from "../github/types";
import "./deployModal.css";

interface DeploymentModalProps extends CoreProps {
  action: DeploymentModalActions, 
  onClose: () => void,
  versionIncrement: VersionIncrements
}

export enum DeploymentModalActions {
  deploy = 'deploy',
  connect = 'connect',
  closed = 'closed',
}

export default class DeployModal extends React.Component<DeploymentModalProps> {

  constructor(props: DeploymentModalProps | Readonly<DeploymentModalProps>) {
    super(props);
    this.state = {
      finished: false,
      percentDone: 0,
    };

    if (props.action === DeploymentModalActions.deploy) {
      setTimeout(() => {// give it a cycle
        deployRepoClick(this);
      }, 10 );
    }else if (props.action === DeploymentModalActions.connect) {
      setTimeout(() => {// give it a cycle
        connectToRepoClick(this);
      }, 10 );
    }
  }

  state: {
    error?: string,
    feedback?: string,
    finished: boolean,
    percentDone: number,
  };

  render() {

    let title: string;
    let titleFeedback: string = '';
    if (this.props.action === DeploymentModalActions.connect) {
      if (this.state.finished) {
        if (!this.state.error) {
          title = `Connected to Repo`;
        }else{
          title = 'Connection Failed';
        }
      }else{
        title = 'Connecting to Repo';
      }
    }else{
      if (this.state.finished) {
        if (!this.state.error) {
          title = `Deployed v${this.props.globalData?.gitHubSettings.version}`;
          titleFeedback = 'It may take a couple minutes to create the NPM package.';
        }else{
          title = 'Deploy Failed';
        }
      }else{
        title = 'Deploying';
      }
    }

    return (
      <div className="deploy-modal"
        onClick={this.props.onClose}>
        <div className="deploy-modal-body">
          <div className="deploy-modal-header">
          {title}
          </div>
          <div className="deploy-modal-msg">
            {titleFeedback ? (
              <div className="deploy-modal-msg-feedback">
                {titleFeedback}
              </div>
            ) : null}
            {this.state.feedback && !this.state.finished ? (
              <div className="deploy-modal-msg-feedback">
                {this.state.feedback}
              </div>
            ) : null}
            {this.state.error ? (
              <div className="deploy-modal-msg-error">
                {this.state.error}
              </div>
            ) : null}
            {this.state.finished ? (
              <DTButton
                className="deploy-modal-msg-done"
                label="OK"
                onClick={this.props.onClose} />
              ) : null }
          </div>
          <div className="deploy-modal-progress-track">
            <div className={`deploy-modal-progress-bar 
              ${this.state.percentDone === 1 ? 'done' : 'active'}`}
              style={{width: `${this.state.percentDone * 100}%`}}></div>
          </div>
        </div>
      </div>
    );
  }
}

