import React, { ChangeEvent } from "react";
import "./App.css";
import "./satellites/satellites.css";
import {
  DesignTokensModel,
  State,
  MessageTypes,
  TokenSetType
} from '../shared/types/types';
import { findWidgetTokenset } from '../widget-src/actions/tokensetActions';
import { renderCssVariables } from './utils/renderCssVariables';
import SwitchUI from "./satellites/switchUI";

export default class App extends React.Component <{}> {

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
    window.onmessage = (evt: any) => {
      const msg = evt.data.pluginMessage;
      const tokenset = findWidgetTokenset(
        msg.nodeId,
        msg.designTokensModel
      );
      this.setState({
        ...this.state,
        ...msg,
        tokenset
      });
    }
    this.sendToWidget = this.sendToWidget.bind(this);

    // inject css vars once
    renderCssVariables();
  }

  state: State;

  sendToWidget(designTokensModel: DesignTokensModel) {
    parent?.postMessage?.({ pluginMessage: {
      name: MessageTypes.modelUpdate,
      designTokensModel,
      tokenset: this.state.tokenset
    } }, "*");

    // make sure state has latest info...
    const tokenset = findWidgetTokenset(
      this.state.nodeId || '', 
      designTokensModel
    );
    this.setState({
      ...this.state,
      designTokensModel,
      tokenset
    })
  }

  render() {
    return (
      <div className="App">
        <div id="editor">
          <SwitchUI
            tokenset={this.state.tokenset}
            designTokensModel={this.state.designTokensModel}
            sendToWidget={this.sendToWidget} />
        </div>
      </div>
    );
  }
}
