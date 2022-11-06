import React from "react";
import {
  CoreProps,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import createNewSteppedSpacingTokens from "../../utils/createNewSteppedSpacingTokens";
import { spacingSteps, SpacingStepTypes } from "../../utils/spacingStepping";
import "./spacingFirstRun.css";

export default class SpacingFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name || 'Spacing',
      baseName: 'spacing',
      baseSpaceSize: undefined,
      spaceStepsType: SpacingStepTypes.none,
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string | undefined,
    baseSpaceSize?: number,
    spaceStepsType: SpacingStepTypes,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Spacing Tokens" />
        <Input
          label="Group Name"
          value={this.state.name}
          onChange={(name: string) => {
            this.setState({name});
          }} 
          validation={
            this.validator.register(
              'name',
              () => {
                return {
                  success: this.state.name ? true : false,
                  message: 'Name is required'
                }
              }
            )
          } />
        <Input
          label="Token Prefix (each token will begin with this)"
          value={this.state.baseName}
          onChange={(baseName: string) => {
            this.setState({baseName});
          }} 
          validation={
            this.validator.register(
              'name',
              () => {
                return {
                  success:  this.state.baseName ? true : false,
                  message: 'Need a base name to create tokens.'
                }
              }
            )
          } />
        <Input
          label="Base Spacing Size"
          value={`${this.state.baseSpaceSize ? this.state.baseSpaceSize : ''}`}
          onChange={(baseSpaceSize: string) => {
            this.setState({baseSpaceSize: parseFloat(baseSpaceSize)});
          }} 
          validation={
            this.validator.register(
              'baseSpaceSize',
              () => {
                return {
                  success: this.state.baseSpaceSize ? true : false,
                  message: 'Base sizing space (number) is required'
                }
              }
            )
          } />
        <Select
          label="Step Pattern"
          value={this.state.spaceStepsType}
          dropdown={spacingSteps}
          onChange={(spaceStepsType: string) => {
            this.setState({
              spaceStepsType,
            });
          }}
          validation={
            this.validator.register(
              'stepPattern',
              () => {
                return {
                  success: this.state.spaceStepsType !== SpacingStepTypes.none,
                  message: 'A spacing step type is required'
                }
              }
            )
          }>
        </Select>
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (this.validator.validate().length === 0 ) {
              createNewSteppedSpacingTokens(
                this.state.baseName,
                this.state.baseSpaceSize,
                this.state.spaceStepsType,
                this.props.tokenGroup,
                this.props.updateTokenGroup
              )
            }
          }}></DTButton>
      </div>
    );
  }
}
