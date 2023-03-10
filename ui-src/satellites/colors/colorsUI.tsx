import React from "react";
import "./colorsUI.css";
import {
  CoreProps,
} from "../../../shared/types/types";
import FirstRun from "./pages/firstRun/colorFirstRun";
import ColorSteps from "./pages/list/colorList";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
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

  render() {
    return (
      <div
        className="ui-list"
        style={this.props.style}>
        {this.renderPage()}
      </div>
    );
  }
}
