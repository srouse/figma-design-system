import React from "react";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import BaseUI from "./baseUI";
import ColorsUI from "./colorsUI";
import ColumnLayoutUI from "./columnLayoutUI";
import ComponentsUI from "./componentsUI";
import { CoreProps } from "../../shared/types/types";
import EffectsUI from "./effectsUI";
import IconsUI from "./iconsUI";
import LayoutUI from "./layoutUI";
import SpacingUI from "./spacingUI";
import "./switchUI.css";
import TypographyUI from "./typographyUI";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import DTTabs from "../components/DTTabs";
import Deployment from "../deployment/deployment";
import Settings from "../settings/settings";

export default class SwitchUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);this.state = {
      page: 'deployment',
    };
  }

  state: {page: string};

  render() {
    let content = (<div>default content</div>);
    switch (this.state.page) {
      case 'tokens':
        content = this.renderTokenContent();
        break;
      case 'deployment' :
        content = (
          <Deployment
            style={{flex: 1}}
            {...this.props} />);
        break;
      case 'settings' :
        content = (
          <Settings
            style={{flex: 1}}
            {...this.props} />)
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

  renderTokenContent() {
    if (!this.props.globalData) return (<div>no global data</div>);
    switch (this.props.tokenGroup?.type) {
      case DSysGroupType.Base :
        return (
          <BaseUI {...this.props} />
        );
      case DSysGroupType.ColorSet :
        return (
          <ColorsUI {...this.props} />
        );
      case DSysGroupType.TypographySet :
        return (
          <TypographyUI {...this.props} />
        );
      case DSysGroupType.EffectSet :
        return (
          <EffectsUI {...this.props} />
        );
      case DSysGroupType.IconSet :
        return (
          <IconsUI {...this.props} />
        );
      case DSysGroupType.ComponentSet :
        return (
          <ComponentsUI {...this.props} />
        );
      case DSysGroupType.Spacing :
        return (
          <SpacingUI {...this.props} />
        );
      case DSysGroupType.LayoutSet :
        return (
          <LayoutUI {...this.props} />
        );
      case DSysGroupType.ColumnLayoutSet :
        return (
          <ColumnLayoutUI {...this.props} />
        );
    }
    return ( <div>no token type found</div> );
  }
}