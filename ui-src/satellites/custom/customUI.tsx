import React from "react";
import "./customUI.css";
import { CoreProps } from "../../../shared/types/types";
import CustomFirstRun from "./pages/firstRun/customFirstRun";
import CustomList from "./pages/list/customList";

export default class CustomUI extends React.Component<CoreProps> {

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
        <CustomFirstRun {...this.props} />
      );
    }else{
      return (
        <CustomList {...this.props} />
      );
    }
  }
}