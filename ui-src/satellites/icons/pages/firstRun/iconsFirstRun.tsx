import React from "react";
import {
  CoreProps,
  MessageRequest,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/input";
import InputHeader from "../../../../components/InputHeader";
import postMessagePromise from "../../../../utils/postMessagePromise";
import FontAwesomeKitButton from "../addNewIcon/fontAwesome/kits/fontAwesomeKitButton";
import * as mixpanel from '../../../../utils/mixpanel';

export default class IconsFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name,
      fontAwesomeApiKey: '',
    }
    this.validator = new Validator();
    mixpanel.track(`firstRun-${props.tokenGroup?.type}`);
  }

  validator: Validator;

  state: {
    name: string | undefined,
    fontAwesomeApiKey: string,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Icon Tokens" />
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
        <FontAwesomeKitButton
          style={{marginBottom: 20}}
          fontAwesomeKit={this.props.fontAwesomeKit}
          fontAwesomeApiKey={this.props.fontAwesomeApiKey}
          updateFontAwesomeKit={this.props.updateFontAwesomeKit}
          updateFontAwesomeApiKey={this.props.updateFontAwesomeApiKey} />
        <div style={{flex: 1}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={async() => {
            if (!this.props.tokenGroup) return;
            if (this.validator.validate().length === 0) {
              const finalTokenGroup = {
                ...this.props.tokenGroup,
                // just the name so we can build from styles
                name: this.state.name,
              };
              await this.props.updateTokenGroup(
                finalTokenGroup
              );
              await postMessagePromise(
                MessageRequest.refreshIconTokens, {}
              );
              mixpanel.track(`createSet-${this.props.tokenGroup?.type}`,
                {
                  name: this.state.name
                }
              );
              return;
            }
          }}></DTButton>
      </div>
    );
  }
}
