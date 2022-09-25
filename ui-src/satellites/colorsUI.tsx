import React from "react";
import "./colorsUI.css";
import { CoreProps } from "../../shared/types/types";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.tokenGroup?.type}</div>
    );
  }
}