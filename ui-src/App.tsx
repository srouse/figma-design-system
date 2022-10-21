import React from "react";
import "./App.css";
import "./satellites/satellites.css";
import {
  State,
  MessageName,
  GlobalData,
  TokenGroup,
  MessageRequest
} from '../shared/types/types';
import { renderCssVariables } from './utils/renderCssVariables';
import SwitchUI from "./satellites/switchUI";
import postMessagePromise from "./utils/postMessagePromise";

export default class App extends React.Component<{}> {

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
    this.updateGlobalData = this.updateGlobalData.bind(this);
    this.updateTokenGroup = this.updateTokenGroup.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);

    // inject css vars once
    renderCssVariables();

    postMessagePromise(
      MessageRequest.stateUpdate
    ).then((result) => {
      this.setState({
        ...this.state,
        ...(result as object),
      });
    });
  }

  state: State;

  updateGlobalData(
    globalData: GlobalData,
  ) {
    parent?.postMessage?.({pluginMessage: {
      name: MessageName.globalDataUpdate,
      globalData
    }}, "*");

    this.setState({
      ...this.state,
      globalData
    })
  }

  async updateTokenGroup(
    tokenGroup: TokenGroup,
  ) {
    await postMessagePromise(
      MessageRequest.updateTokenGroup,
      {tokenGroup: {
        ...tokenGroup
      }}
    );
    this.setState({
      ...this.state,
      tokenGroup
    });
    this.refreshTokens();
  }

  refreshTokens() {
    postMessagePromise(
      MessageRequest.refreshTokensFromStyles
    ).then((result) => {
      console.log('REFRESH', result);
      this.setState({
        ...this.state,
        ...(result as object),
      });
    });
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
            updateTokenGroup={this.updateTokenGroup}
            refreshTokens={this.refreshTokens} />
        </div>
      </div>
    );
  }
}
