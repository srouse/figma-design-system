import React from "react";
import "./typographyUI.css";
import { CoreProps } from "../../../shared/types/types";
import TypographyFirstRun from "./pages/typographyFirstRun";
import TypographyList from "./pages/typographyList";

export default class TypographyUI extends React.Component<CoreProps> {

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
        <TypographyFirstRun {...this.props} />
      );
    }else{
      return (
        <TypographyList {...this.props} />
      );
    }
  }
}