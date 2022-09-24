import React from "react";
import "./effectsUI.css";
import SatelliteHeaderUI from "../components/satelliteHeaderUI";
import DTTabs from "../components/DTTabs";
import Deployment from "../deployment/deployment";
import Settings from "../settings/settings";
import { CoreProps } from "../../shared/types/types";

export default class EffectsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
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
          {...this.props}
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