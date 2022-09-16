import React from "react";
import { DesignSystemModel, TokenSet } from "../../shared/types/types";
import Input from "./input";
import "./satelliteHeaderUI.css";
import designSystemClassName from '../../shared/designSystemClassName';

interface SatelliteHeaderProps {
  tokenset: TokenSet | undefined,
  designSystemModel: DesignSystemModel | undefined,
  sendToWidget: (dsys: DesignSystemModel) => void
}

export default class SatelliteHeaderUI extends React.Component <SatelliteHeaderProps> {

  constructor(props: SatelliteHeaderProps | Readonly<SatelliteHeaderProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="editor-header">
        <Input
          className="satellite-header-name"
          label="Name" 
          value={this.props.tokenset?.name}
          feedbackValue={designSystemClassName(
            this.props.designSystemModel,
            this.props.tokenset,
          )}
          onChange={(value: string) => {
            if (this.props.designSystemModel) {
              const newTokenSets = this.props.designSystemModel?.tokensets.map(
                (tokenSet : TokenSet) => {
                  if (tokenSet.nodeId === this.props.tokenset?.nodeId) {
                    return {
                      ...tokenSet,
                      name: value,
                    }
                  }
                  return tokenSet;
                }
              )
              this.props.sendToWidget({
                ...this.props.designSystemModel,
                tokensets: newTokenSets || [],
              })
            }
          }} />
        </div>
    );
  }
}

