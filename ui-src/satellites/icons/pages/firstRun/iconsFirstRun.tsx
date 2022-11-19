import React from "react";
import {
  CoreProps,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";

export default class IconsFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name,
      fontAwesomeApiKey: '',
    }
    this.validator = new Validator();
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
        <Input
          label="Font Awesome API Key (optional)"
          value={this.state.fontAwesomeApiKey}
          onEnterOrBlur={(fontAwesomeApiKey: string) => {
            this.setState({fontAwesomeApiKey});
          }} />
        <div style={{flex: 1}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.props.tokenGroup) return;
            if (this.validator.validate().length === 0) {
              const finalTokenGroup = {
                ...this.props.tokenGroup,
                // just the name so we can build from styles
                name: this.state.name,
              };
              this.props.updateTokenGroup(finalTokenGroup);
              this.props.updateFontAwesomeApiKey(this.state.fontAwesomeApiKey);
              return;
            }
          }}></DTButton>
      </div>
    );
  }
}
