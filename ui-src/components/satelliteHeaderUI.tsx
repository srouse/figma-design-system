import React from "react";
import {
  CoreProps,
} from "../../shared/types/types";
import Input from "./input";
import "./satelliteHeaderUI.css";
import processClassName from '../../shared/processClassName';

export default class SatelliteHeaderUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="editor-header">
        <Input
          className="satellite-header-name"
          label="Name" 
          value={this.props.tokenGroup?.name}
          feedbackValue={processClassName(
            this.props.globalData?.prefix,
            this.props.tokenGroup?.name,
          )}
          onChange={(value: string) => {
            if (this.props.tokenGroup) {
              this.props.updateTokenGroup({
                ...this.props.tokenGroup,
                name: value,
              });
            }
          }} />
     </div>
    );
  }
}

