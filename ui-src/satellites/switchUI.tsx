import React from "react";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import BaseUI from "./baseUI";
import ColorsUI from "./colors/colorsUI";
import ColumnLayoutUI from "./columnLayoutUI";
import ComponentsUI from "./componentsUI";
import { CoreProps } from "../../shared/types/types";
import EffectsUI from "./effectsUI";
import IconsUI from "./iconsUI";
import LayoutUI from "./layoutUI";
import SpacingUI from "./spacingUI";
import "./switchUI.css";
import TypographyUI from "./typography/typographyUI";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import DTTabs from "../components/DTTabs";
import Deployment from "../deployment/deployment";
import Settings from "../settings/settings";

export default class SwitchUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      page: 'tokens',
    };
  }

  state: {page: string};

  render() {
    return (
      <div className="satellite">
        <SatelliteHeaderUI
          {...this.props}
           />
        <DTTabs 
          tabs={[
            {name: 'Tokens', value: 'tokens'},
            {name: 'Deploy', value: 'deployment'},
            {name: 'Settings', value: 'settings'},
          ]}
          value={this.state.page}
          onValueChange={(value: string) => this.setState({page:value})} />
        {this.renderTokenContent()}
        <Deployment
          style={{
            flex: 1, 
            display: this.state.page === 'deployment' ? 'block' : 'none',
          }}
          {...this.props} />
        <Settings
            style={{
              flex: 1,
              display: this.state.page === 'settings' ? 'block' : 'none',
            }}
            {...this.props} />
      </div>
    );
  }

  renderSettings() {
    
  }

  renderTokenContent() {
    if (!this.props.globalData) return (<div>no global data</div>);
    switch (this.props.tokenGroup?.type) {
      case DSysGroupType.Base :
        return (
          <BaseUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.ColorSet :
        return (
          <ColorsUI
          style={{
            display: this.state.page === 'tokens' ? 'block' : 'none',
          }} {...this.props} />
        );
      case DSysGroupType.TypographySet :
        return (
          <TypographyUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.EffectSet :
        return (
          <EffectsUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.IconSet :
        return (
          <IconsUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.ComponentSet :
        return (
          <ComponentsUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.Spacing :
        return (
          <SpacingUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.LayoutSet :
        return (
          <LayoutUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.ColumnLayoutSet :
        return (
          <ColumnLayoutUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
    }
    return ( 
      <div
        style={{
          display: this.state.page === 'tokens' ? 'block' : 'none',
        }} {...this.props}>no token type found</div>
    );
  }
}