import React from "react";
import { CoreProps, DSysGroupType, MessageRequest } from "../../../../../shared";
import Input from "../../../../components/input";
import postMessagePromise from "../../../../utils/postMessagePromise";

export default class ColorsSettings extends React.Component<CoreProps> {

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
    </>);
  }
}
