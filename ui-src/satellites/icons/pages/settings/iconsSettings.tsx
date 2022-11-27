import React from "react";
import {
  CoreProps,
  MessageRequest
} from "../../../../../shared";
import Input from "../../../../components/Input";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";
import FontAwesomeKitButton from "../addNewIcon/fontAwesome/kits/fontAwesomeKitButton";

export default class IconsSettings extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (<>
      <Input
        label="Name" 
        value={this.props.tokenGroup?.name}
        onEnterOrBlur={async (value: string) => {
          if (!this.props.tokenGroup) return;
          await postMessagePromise(
            MessageRequest.changeIconCompName,
            {
              newName: value,
            }
          );
          this.props.updateTokenGroup({
            ...this.props.tokenGroup,
            name: value,
          });
        }} />
      <FontAwesomeKitButton
        style={{marginBottom: 20}}
        fontAwesomeKit={this.props.fontAwesomeKit}
        fontAwesomeApiKey={this.props.fontAwesomeApiKey}
        updateFontAwesomeKit={this.props.updateFontAwesomeKit}
        updateFontAwesomeApiKey={this.props.updateFontAwesomeApiKey} />
    </>);
  }
}
