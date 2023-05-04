import React from "react";
import {
  CoreProps,
} from "../../shared";
import "./deployment.css";
import GitHubDeploy from "./github/githubDeploy";
import DTTabs from "../components/DTTabs";
import ManualDeploy from "./manual/manualDeploy";
import * as mixpanel from '../utils/mixpanel';

interface DeploymentProps extends CoreProps {
  style?: object
}

export default class Deployment extends React.Component<DeploymentProps> {

  constructor(props: DeploymentProps | Readonly<DeploymentProps>) {
    super(props);
    this.state = {
      page: 'manual',
    };
  }

  state: {page: string};

  render() {
    return (
      <div
        style={this.props.style || {}}>
        <div
          className="deployment">
          <DTTabs
                tabs={[
                {name: 'Download', value: 'manual'},
                {name: 'GitHub Deploy', value: 'github'},
              ]}
              value={this.state.page}
              design="small"
              onValueChange={(value: string) => {
                mixpanel.track(`modal-tab-code-change-${value}`);
                this.setState({page:value});
              }} />
          {this.state.page === 'manual' ? (
            <ManualDeploy {...this.props} />
          ) : (
            <GitHubDeploy {...this.props} />
          )}
        </div>
      </div>
    );
  }
}
