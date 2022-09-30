import React from "react";
import "./layoutUI.css";
import { CoreProps } from "../../shared/types/types";

export default class LayoutUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>{this.props.tokenGroup?.type}</div>
    );
  }
}