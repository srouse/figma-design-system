import React from "react";
import "./spacingUI.css";
import { CoreProps } from "../../../shared/types/types";
import SpacingFirstRun from "./pages/firstRun/spacingFirstRun";
import SpacingList from "./pages/list/spacingList";

export default class SpacingUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <SpacingFirstRun {...this.props} />
      );
    }else{
      return (
        <SpacingList {...this.props} />
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