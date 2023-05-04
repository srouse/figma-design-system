import React from "react";
import {
  CoreProps,
  DSysEffectTokenset,
  DSysGroupType,
  DSysLevel,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import * as mixpanel from '../../../../utils/mixpanel';

export default class EffectsFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name || '',
      baseName: '',
    }
    this.validator = new Validator();
    mixpanel.track(`firstRun-${props.tokenGroup?.type}`);
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
          label="Create Effect Tokens" />
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
            const tokenset: DSysEffectTokenset = {
              $extensions: {
                'dsys.level': DSysLevel.tokenset,
                'dsys.type': DSysGroupType.EffectSet,
                "dsys.name": this.state.name,
                "dsys.nodeId": '?'
              },
              $description: 'a set of spacing tokens',
            }
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
