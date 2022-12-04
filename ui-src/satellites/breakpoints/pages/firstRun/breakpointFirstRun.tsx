import React from "react";
import {
  CoreProps,
  DSysGroupType,
  DSysLevel,
  Validator,
  DSysBreakpointTokenset,
  DTTokenType,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import uid from "../../../../utils/uid";

export default class BreakpointFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name || 'breakpoints',
      baseName: '',
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string | undefined,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Breakpoint Tokens" />
        <Input
          label="Name"
          value={this.state.name}
          onEnterOrBlur={(name: string) => {
            this.setState({name});
          }} 
          validation={
            this.validator.register(
              'name',
              () => {
                return {
                  success: this.state.name ? true : false,
                  message: 'Name is required'
                }
              }
            )
          } />
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.state.name || !this.props.tokenGroup) return;
            // build an empty tokenset and tokengroup and let list build groups
            const tokenset: DSysBreakpointTokenset = {
              $extensions: {
                'dsys.level': DSysLevel.tokenset,
                'dsys.type': DSysGroupType.BreakpointSet,
                "dsys.name": this.state.name,
                "dsys.nodeId": '?'
              },
              $description: 'a set of custom tokens',
            }

            // put together a usable default...
            tokenset['phone-only'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'phone-only',
                "dsys.index": 0,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'down',
              $value: 599,
            };
            tokenset['tablet-portrat-up'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'tablet-portrat-up',
                "dsys.index": 1,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 600,
            };
            tokenset['tablet-landscape-up'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'tablet-landscape-up',
                "dsys.index": 2,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 900,
            };
            tokenset['desktop-up'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'desktop-up',
                "dsys.index": 3,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 1200,
            };
            tokenset['big-desktop-up'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'big-desktop-up',
                "dsys.index": 4,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 1800,
            };

            const finalTokenGroup = {
              ...this.props.tokenGroup,
              name: this.state.name,
              tokensets: [tokenset]
            };
            this.props.updateTokenGroup(finalTokenGroup);
            this.props.refreshTokens();
          }}></DTButton>
      </div>
    );
  }
}
