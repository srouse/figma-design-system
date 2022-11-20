import React from "react";
import "./iconsUI.css";
import { CoreProps } from "../../../shared/types/types";
import IconsFirstRun from "./pages/firstRun/iconsFirstRun";
import IconsList from "./pages/list/iconsList";

export default class IconsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <IconsFirstRun {...this.props} />
      );
    }else{
      return (
        <IconsList {...this.props} />
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