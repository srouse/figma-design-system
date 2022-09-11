import React from "react";
import { TokenSetType } from "../../enums";
import { DesignSystemModel, TokenSet } from "../../types";
import Base from "./base";
import "./switch.css";

interface SwitchProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class Switch extends React.Component <SwitchProps> {

  constructor(props: SwitchProps | Readonly<SwitchProps>) {
    super(props);
  }

  render() { 
    switch (this.props.tokenset?.type) {
      case TokenSetType.Base :
        return (
          <Base
            designSystemModel={this.props.designSystemModel}
            sendToWidget={this.props.sendToWidget} />
        );
    }


    return ( <div>no token type found</div> );
  }
}