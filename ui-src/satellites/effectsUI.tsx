import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import "./effectsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import DTButton, { DTButtonColor, DTButtonDesign } from "../components/DTButton";
import DTTabs from "../components/DTTabs";
import Deployment from "../deployment/deployment";
import Settings from "../settings/settings";

interface EffectsUIProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class EffectsUI extends React.Component <EffectsUIProps> {

  constructor(props: EffectsUIProps | Readonly<EffectsUIProps>) {
    super(props);
    this.state = {
      page: 'tokens'
    };
  }

  state: {page: string};

  render() {
    let content = (<div>default content</div>);
    switch (this.state.page) {
      case 'tokens':
        break;
      case 'deployment' :
        content = (<Deployment style={{flex: 1}} />);
        break;
      case 'settings' :
        content = (<Settings style={{flex: 1}} />)
        break;
    }
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          tokenset={this.props.tokenset}
          designTokensModel={this.props.designTokensModel}
          sendToWidget={this.props.sendToWidget}
           />
        <DTTabs 
          tabs={[
            {name: 'Tokens', value: 'tokens'},
            {name: 'Deployment', value: 'deployment'},
            {name: 'Settings', value: 'settings'},
          ]}
          value={this.state.page}
          onValueChange={(value: string) => this.setState({page:value})} />
        {content}
      </div>
    );
  }
}