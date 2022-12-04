import React from "react";
import "./componentsUI.css";
import { CoreProps } from "../../../shared/types/types";
import ComponentsFirstRun from "./pages/firstRun/componentsFirstRun";
import ComponentList from "./pages/list/componentList";

export default class ComponentsUI extends React.Component<CoreProps> {

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
        <ComponentsFirstRun {...this.props} />
      );
    }else{
      return (
        <ComponentList {...this.props} />
      );
    }
  }
}