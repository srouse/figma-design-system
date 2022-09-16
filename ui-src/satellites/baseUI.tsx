import React from "react";
import "./baseUI.css";
import Input from "../components/input";
import { DesignSystemModel } from "../../shared/types/types";

interface BaseProps {
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class BaseUI extends React.Component <BaseProps> {

  constructor(props: BaseProps | Readonly<BaseProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="base">
        <div className="editor-header">
          <Input
            className="base-prefix"
            label="Prefix" 
            value={this.props.designSystemModel?.prefix} 
            onChange={(value: string) => {
              if (this.props.designSystemModel) {
                this.props.sendToWidget({
                  ...this.props.designSystemModel,
                  prefix: value,
                })
              }
            }} />
          <Input
            className="base-full-name"
            label="Full Name" 
            value={this.props.designSystemModel?.fullName} 
            onChange={(value: string) => {
              if (this.props.designSystemModel) {
                this.props.sendToWidget({
                  ...this.props.designSystemModel,
                  fullName: value,
                })
              }
            }} />
          </div>
          ddd
      </div>
    );
  }
}