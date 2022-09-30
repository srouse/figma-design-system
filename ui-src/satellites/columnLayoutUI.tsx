import React from "react";
import "./columnLayoutUI.css";
import { CoreProps } from "../../shared/types/types";

export default class ColumnLayoutUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>{this.props.tokenGroup?.type}</div>
    );
  }
}