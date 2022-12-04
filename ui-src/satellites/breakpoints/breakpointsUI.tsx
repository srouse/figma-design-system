import React from "react";
import "./breakpointsUI.css";
import { CoreProps } from "../../../shared/types/types";
import BreakpointFirstRun from "./pages/firstRun/breakpointFirstRun";
import BreakpointList from "./pages/list/breakpointList";

export default class BreakpointsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
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

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <BreakpointFirstRun {...this.props} />
      );
    }else{
      return (
        <BreakpointList {...this.props} />
      );
    }
  }
}