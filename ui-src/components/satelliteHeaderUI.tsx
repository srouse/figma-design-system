import React from "react";
import { DesignTokensModel, TokenSet } from "../../shared/types/types";
import Input from "./input";
import "./satelliteHeaderUI.css";
import designSystemClassName from '../../shared/designSystemClassName';

interface SatelliteHeaderProps {
  tokenset: TokenSet | undefined,
  designTokensModel: DesignTokensModel | undefined,
  sendToWidget: (dsys: DesignTokensModel) => void
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
            this.props.designTokensModel,
            this.props.tokenset,
          )}
          onChange={(value: string) => {
            if (this.props.designTokensModel) {
              const newTokenSets = this.props.designTokensModel?.tokensets.map(
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
                ...this.props.designTokensModel,
                tokensets: newTokenSets || [],
              })
            }
          }} />
        </div>
    );
  }
}

