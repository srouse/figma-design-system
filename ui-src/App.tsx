import React, { ChangeEvent } from "react";
import "./App.css";
import { DesignSystemModel, State } from '../shared/types';
import { findWidgetTokenset } from '../widget-src/actions/tokensetActions';
import { MessageTypes, TokenSetType } from "../shared/enums";

import SwitchUI from "./satellites/switchUI";

export default class App extends React.Component <{}> {

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
    window.onmessage = (evt: any) => {
      const msg = evt.data.pluginMessage;
      const tokenset = findWidgetTokenset(msg.nodeId, msg.designSystemModel);
      this.setState({
        ...this.state,
        ...msg,
        tokenset
      });
    }
    this.sendToWidget = this.sendToWidget.bind(this);
    this.onTokenSetTypeChange = this.onTokenSetTypeChange.bind(this);
  }

  state: State;

  sendToWidget(designSystemModel: DesignSystemModel) {
    parent?.postMessage?.({ pluginMessage: {
      name: MessageTypes.modelUpdate,
      designSystemModel,
    } }, "*");
    // make sure state has latest info...
    const tokenset = findWidgetTokenset(
      this.state.nodeId || '', 
      designSystemModel
    );
    this.setState({
      ...this.state,
      designSystemModel,
      tokenset
    })
  }

  onTokenSetTypeChange(evt: ChangeEvent) {
    // centralized this to the widget since it needs to do the same 
    // thing when in default mode...
    const newTokenSetType =
      (evt.target as HTMLSelectElement).value as TokenSetType;
    parent?.postMessage?.({ pluginMessage: {
      name: MessageTypes.tokenSetTypeChange,
      newTokenSetType,
      nodeId: this.state.nodeId
    } }, "*");
  }

  render() {
    return (
      <div className="App">
        <div id="editor">
          <SwitchUI
            tokenset={this.state.tokenset}
            designSystemModel={this.state.designSystemModel}
            sendToWidget={this.sendToWidget} />
        </div>
      </div>
    );
  }
}
