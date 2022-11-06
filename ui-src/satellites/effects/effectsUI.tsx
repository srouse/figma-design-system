import React from "react";
import "./effectsUI.css";
import { CoreProps } from "../../../shared/types/types";
import EffectsFirstRun from "./pages/effectsFirstRun";
import EffectsList from "./pages/list/effectsList";

export default class EffectsUI extends React.Component<CoreProps> {

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
        <EffectsFirstRun {...this.props} />
      );
    }else{
      return (
        <EffectsList {...this.props} />
      );
    }
  }
}