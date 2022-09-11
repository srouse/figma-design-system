import React, { ChangeEvent } from "react";
import "./App.css";
import { DesignSystemModel, State } from '../types';
import { findWidgetTokenset } from '../widget-src/actions/tokensetActions';
import { MessageTypes, TokenSetType } from "../enums";

import Switch from "./satellites/switch";

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
    this.setState({
      ...this.state,
      designSystemModel
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
          <Switch 
            tokenset={this.state.tokenset}
            designSystemModel={this.state.designSystemModel}
            sendToWidget={this.sendToWidget} />
         {this.state.nodeId}
         <label>
            Token Set Type
            
            <select
              name="statue"
              value={this.state.tokenset?.type}
              onChange={this.onTokenSetTypeChange}>
              {Object.keys(TokenSetType).map(tokenSetTypeKey => {
                if (tokenSetTypeKey === TokenSetType.Base) {
                  return;
                }
                return (
                  <option
                    value={tokenSetTypeKey}
                    key={`tokentset-type-${tokenSetTypeKey}`}>
                    {tokenSetTypeKey.replace(/([A-Z])/g, ' $1')}
                  </option>
                );
              })}
            </select>
          </label>
          <div onClick={() => {
            console.log( document.querySelector('Input') );
          }}>clcik me</div>
        </div>
      </div>
    );
  }
}

