import React from "react";
import "./colorsUI.css";
import {
  CoreProps,
} from "../../../shared/types/types";
import FirstRun from "./pages/firstRun";
import ColorSteps from "./pages/colorSteps";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div
        className="colors"
        style={this.props.style}>
        {this.renderPage()}
      </div>
    );
  }

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <FirstRun {...this.props} />
      );
    }else{
      return (
        <ColorSteps {...this.props} />
      );
    }
  }
}


