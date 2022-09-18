import React from "react";
import "./deployment.css";

interface DeploymentProps {
  test?: string,
  style?: object
}

export default class Deployment extends React.Component <DeploymentProps> {

  constructor(props: DeploymentProps | Readonly<DeploymentProps>) {
    super(props);
  }

  render() { 
    return (
      <div
        className="deployment"
        style={this.props.style || {}}>
        deployment
      </div>
    );
  }
}