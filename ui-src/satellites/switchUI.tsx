import React from "react";
import { DSysGroupType } from "../../shared/types/designSystemTypes";
import BaseUI from "./baseUI";
import ColorsUI from "./colors/colorsUI";
import ComponentsUI from "./components/componentsUI";
import { CoreProps } from "../../shared/types/types";
import EffectsUI from "./effects/effectsUI";
import IconsUI from "./icons/iconsUI";
import SpacingUI from "./spacing/spacingUI";
import "./switchUI.css";
import TypographyUI from "./typography/typographyUI";
import SatelliteHeaderUI from "../components/SatelliteHeaderUI";
import DTTabs from "../components/DTTabs";
import Deployment from "../deployment/deployment";
import Settings from "../settings/settings";
import ColorsSettings from "./colors/pages/settings/colorsSettings";
import TypographySettings from "./typography/typographySettings";
import EffectsSettings from "./effects/pages/settings/effectsSettings";
import SpacingSettings from "./spacing/pages/settings/spacingSettings";
import IconsSettings from "./icons/pages/settings/iconsSettings";
import BreakpointsUI from "./breakpoints/breakpointsUI";
import CustomUI from "./custom/customUI";
import CustomSettings from "./custom/pages/settings/customSettings";
import BreakpointSettings from "./breakpoints/pages/settings/breakpointSettings";
import ComponentsSettings from "./components/pages/settings/componentsSettings";

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
        {(
          this.props.tokenGroup?.name || 
          this.props.tokenGroup?.type == DSysGroupType.Base
        ) ? (
          <DTTabs 
            tabs={[
              {name: 'Tokens', value: 'tokens'},
              {name: 'Deploy', value: 'deployment'},
              {name: 'Settings', value: 'settings'},
            ]}
            value={this.state.page}
            onValueChange={(value: string) => this.setState({page:value})} />
        ) : '' }
        {this.renderTokenContent()}
        <Deployment
          style={{
            flex: 1, 
            display: this.state.page === 'deployment' ? 'block' : 'none',
          }}
          {...this.props} />
        {this.renderSettings()}
      </div>
    );
  }

  renderSettings() {
    let localSettings = undefined;
    switch (this.props.tokenGroup?.type) {
      case DSysGroupType.Base :
        localSettings = undefined;
        break;
      case DSysGroupType.ColorSet :
        localSettings = <ColorsSettings {...this.props} />;
        break;
      case DSysGroupType.CustomSet :
        localSettings = <CustomSettings {...this.props} />;
        break;
      case DSysGroupType.TypographySet :
        localSettings = <TypographySettings {...this.props} />;
        break;
      case DSysGroupType.EffectSet :
        localSettings = <EffectsSettings {...this.props} />;
        break;
      case DSysGroupType.IconSet :
        localSettings = <IconsSettings {...this.props} />;
        break;
      case DSysGroupType.Spacing :
        localSettings = <SpacingSettings {...this.props} />;
        break;
      case DSysGroupType.BreakpointSet :
        localSettings = <BreakpointSettings {...this.props} />;
        break;
      case DSysGroupType.ComponentSet :
        localSettings = <ComponentsSettings {...this.props} />;
        break;
    }
    return (
      <Settings
        style={{
          flex: 1,
          display: this.state.page === 'settings' ? 'block' : 'none',
        }}
        localSettings={localSettings}
        {...this.props} />
    );
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
      case DSysGroupType.BreakpointSet :
        return (
          <BreakpointsUI
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
      case DSysGroupType.ComponentSet :
        return (
          <ComponentsUI
            style={{
              display: this.state.page === 'tokens' ? 'block' : 'none',
            }} {...this.props} />
        );
      case DSysGroupType.CustomSet :
        return (
          <CustomUI
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
      case DSysGroupType.Spacing :
        return (
          <SpacingUI
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
    }
    return ( 
      <div
        style={{
          display: this.state.page === 'tokens' ? 'block' : 'none',
        }} {...this.props}>no token type found</div>
    );
  }
}