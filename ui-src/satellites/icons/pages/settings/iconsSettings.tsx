import React from "react";
import { CoreProps, DSysGroupType, MessageRequest } from "../../../../../shared";
import Input from "../../../../components/Input";
import postMessagePromise from "../../../../utils/postMessagePromise";

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
            MessageRequest.changeStylesFolder,
            {
              folderName: this.props.tokenGroup?.name,
              newFolderName: value,
              type: DSysGroupType.ColorSet
            }
          );
          this.props.updateTokenGroup({
            ...this.props.tokenGroup,
            name: value,
          });
        }} />
      <Input
        label="Font Awesome API Key (optional)" 
        value={this.props.fontAwesomeApiKey}
        type="password"
        onEnterOrBlur={async (value: string) => {
          this.props.updateFontAwesomeApiKey(value);
        }} />
    </>);
  }
}
