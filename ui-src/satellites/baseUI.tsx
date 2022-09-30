import React from "react";
import "./baseUI.css";
import { CoreProps } from "../../shared/types/types";

export default class BaseUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>{this.props.tokenGroup?.type}</div>
    );
  }
}