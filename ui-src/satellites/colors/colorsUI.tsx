import React from "react";
import "./colorsUI.css";
import {
  CoreProps,
} from "../../../shared/types/types";
import postMessagePromise from "../../utils/postMessagePromise";
import FirstRun from "./pages/firstRun";
import ColorSteps from "./pages/colorSteps";
import { stylesToDSysTokenset } from "./utils/stylesUtils";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.pullStyles();
  }

  /*state: {
    colorStyles?: any,
  } = {};*/

  pullStyles() {
    stylesToDSysTokenset('poop');
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


