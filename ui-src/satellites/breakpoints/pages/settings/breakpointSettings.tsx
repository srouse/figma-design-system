import React from "react";
import { CoreProps } from "../../../../../shared";
import Input from "../../../../components/input";

export default class BreakpointSettings extends React.Component<CoreProps> {

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
          this.props.updateTokenGroup({
            ...this.props.tokenGroup,
            name: value,
          });
        }} />
    </>);
  }
}