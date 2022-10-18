import React from "react";
import "./typographyUI.css";
import { CoreProps } from "../../../shared/types/types";

export default class TypographyUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div style={this.props.style}>{this.props.tokenGroup?.type}</div>
    );
  }
}