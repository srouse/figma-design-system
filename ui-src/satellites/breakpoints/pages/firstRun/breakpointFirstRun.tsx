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
import * as mixpanel from '../../../../utils/mixpanel';

export default class BreakpointFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name || 'breakpoints',
      baseName: '',
    }
    this.validator = new Validator();
    mixpanel.track(`firstRun-${this.props.tokenGroup?.type}`);
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string | undefined,
  }

  render() {
    return (
      <div className="first-run breakpoint">
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
        <div
          className="defaults">
          sm, md, lg, and xlg will be created as a default,
          but can be changed later.
        </div>
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
            tokenset['sm'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'sm',
                "dsys.index": 0,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 576,
            };
            tokenset['md'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'md',
                "dsys.index": 1,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 768,
            };
            tokenset['lg'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'lg',
                "dsys.index": 2,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 992,
            };
            tokenset['xlg'] = {
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": 'xlg',
                "dsys.index": 3,
                "dsys.uid": uid()
              },
              $type: DTTokenType.breakpoint,
              $direction: 'up',
              $value: 1200,
            };

            const finalTokenGroup = {
              ...this.props.tokenGroup,
              name: this.state.name,
              tokensets: [tokenset]
            };
            this.props.updateTokenGroup(finalTokenGroup);
            this.props.refreshTokens();

            mixpanel.track(`createSet-${this.props.tokenGroup?.type}`,
              {
                name: this.state.name
              }
            );
          }}></DTButton>
      </div>
    );
  }
}
