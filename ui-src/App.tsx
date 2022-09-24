import React from "react";
import "./App.css";
import "./satellites/satellites.css";
import {
  State,
  MessageTypes,
  GlobalData,
  TokenGroup
} from '../shared/types/types';
import { renderCssVariables } from './utils/renderCssVariables';
import SwitchUI from "./satellites/switchUI";

export default class App extends React.Component<{}> {

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
    window.onmessage = (evt: any) => {
      const msg = evt.data.pluginMessage;
      this.setState({
        ...this.state,
        ...msg,
      });
    }
    this.updateGlobalData = this.updateGlobalData.bind(this);
    this.updateTokenGroup = this.updateTokenGroup.bind(this);

    // inject css vars once
    renderCssVariables();
  }

  state: State;

  updateGlobalData(
    globalData: GlobalData,
  ) {
    parent?.postMessage?.({pluginMessage: {
      name: MessageTypes.globalDataUpdate,
      globalData
    }}, "*");

    this.setState({
      ...this.state,
      globalData
    })
  }

  updateTokenGroup(
    tokenGroup: TokenGroup,
  ) {
    parent?.postMessage?.({pluginMessage: {
      name: MessageTypes.tokenGroupUpdate,
      tokenGroup
    }}, "*");

    this.setState({
      ...this.state,
      tokenGroup
    })
  }

  render() {
    if (!this.state.tokenGroup) return '';
    return (
      <div className="App">
        <div id="editor">
          <SwitchUI
            tokenGroup={this.state.tokenGroup}
            globalData={this.state.globalData}
            updateGlobalData={this.updateGlobalData}
            updateTokenGroup={this.updateTokenGroup} />
        </div>
      </div>
    );
  }
}
