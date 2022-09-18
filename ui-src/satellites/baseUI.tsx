import React from "react";
import "./baseUI.css";
import Input from "../components/input";
import { DesignTokensModel } from "../../shared/types/types";
import DTButton from "../components/DTButton";

interface BaseProps {
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
}

export default class BaseUI extends React.Component <BaseProps> {

  constructor(props: BaseProps | Readonly<BaseProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="base satellite">
        <div className="editor-header">
          <Input
            className="base-prefix"
            label="Prefix" 
            value={this.props.designTokensModel?.prefix} 
            onChange={(value: string) => {
              if (this.props.designTokensModel) {
                this.props.sendToWidget({
                  ...this.props.designTokensModel,
                  prefix: value,
                })
              }
            }} />
          <Input
            className="base-full-name"
            label="Full Name" 
            value={this.props.designTokensModel?.fullName} 
            onChange={(value: string) => {
              if (this.props.designTokensModel) {
                this.props.sendToWidget({
                  ...this.props.designTokensModel,
                  fullName: value,
                })
              }
            }} />
          </div>
          <DTButton
            label="click this"
            onClick={(evt) => console.log(evt)} />
      </div>
    );
  }
}