import React from "react";
import "./App.css";
import "./satellites/satellites.css";
import {
  State,
  GlobalData,
  TokenGroup,
  MessageRequest
} from '../shared/types/types';
import { renderCssVariables } from './utils/renderCssVariables';
import SwitchUI from "./satellites/switchUI";
import postMessagePromise, { addMessageListener, removeMessageListener } from "./utils/postMessagePromise";
import Modal from "./components/Modal/Modal";

export default class App extends React.Component<{}> {

  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.state = {};
    this.updateGlobalData = this.updateGlobalData.bind(this);
    this.updateTokenGroup = this.updateTokenGroup.bind(this);
    this.refreshTokens = this.refreshTokens.bind(this);
    this.createPrompt = this.createPrompt.bind(this);
    this.closePrompt = this.closePrompt.bind(this);
    this.updateFontAwesomeApiKey = this.updateFontAwesomeApiKey.bind(this);
    this.updateFontAwesomeKit = this.updateFontAwesomeKit.bind(this);
    this.updateIconSizes = this.updateIconSizes.bind(this);
    this.widgetMessageListener = this.widgetMessageListener.bind(this);

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

    addMessageListener(this.widgetMessageListener);
  }

  componentWillUnmount(): void {
    // a little silly since entire plugin is closing, but here we are...
    removeMessageListener(this.widgetMessageListener);
  }

  widgetMessageListener(msg: any) {
    if (!msg) return;
    switch (msg.name) {
      case 'refreshState' :
        this.setState({
          ...this.state,
          ...(msg.state as object),
        });
        break;
    }
  }

  state: State;

  updateGlobalData(
    globalData: GlobalData,
  ) {
    // keep all children talking to this function
    // because it is more than just sending promise
    postMessagePromise(
      MessageRequest.globalDataUpdate,
      {
        globalData
      }
    )
    this.setState({
      ...this.state,
      globalData
    });
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
    return tokenGroup;
  }

  async updateFontAwesomeApiKey(
    fontAwesomeApiKey: string
  ) {
    await postMessagePromise(
      MessageRequest.setFontAwesomeAPIKey,
      {
        fontAwesomeApiKey,
      }
    );
    this.setState({
      fontAwesomeApiKey
    });
    return fontAwesomeApiKey;
  }

  async updateFontAwesomeKit(
    fontAwesomeKit: string
  ) {
    await postMessagePromise(
      MessageRequest.setFontAwesomeKit,
      {
        fontAwesomeKit,
      }
    );
    this.setState({
      fontAwesomeKit
    });
    return fontAwesomeKit;
  }

  async updateIconSizes(
    iconSizes: number[]
  ) {
    await postMessagePromise(
      MessageRequest.setIconSizes,
      {
        iconSizes,
      }
    );
    this.setState({
      iconSizes
    });
    return iconSizes;
  }

  createPrompt(
    title: string,
    content: JSX.Element
  ) {
    this.setState({
      promptTitle: title,
      promptContent: content,
    })
  }

  closePrompt() {
    this.setState({
      promptTitle: undefined,
      promptContent: undefined,
    })
  }

  refreshTokens() {
    postMessagePromise(
      MessageRequest.refreshTokensFromStyles
    ).then((result) => {
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
            fontAwesomeApiKey={this.state.fontAwesomeApiKey}
            updateFontAwesomeApiKey={this.updateFontAwesomeApiKey}
            fontAwesomeKit={this.state.fontAwesomeKit}
            updateFontAwesomeKit={this.updateFontAwesomeKit}
            iconSizes={this.state.iconSizes}
            updateIconSizes={this.updateIconSizes}
            refreshTokens={this.refreshTokens}
            createPrompt={this.createPrompt}
            closePrompt={this.closePrompt} />
        </div>
        <Modal
          title="What Type of Effect?"
          body={this.state.promptContent}
          onClose={() => {}}
          open={this.state.promptContent ? true : false}></Modal>
      </div>
    );
  }
}
