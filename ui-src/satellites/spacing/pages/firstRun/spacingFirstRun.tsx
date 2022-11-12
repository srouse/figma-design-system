import React from "react";
import {
  CoreProps,
  DSysGroupType,
  DSysLevel,
  DSysSpacingTokenset,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import createNewSteppedSpacingTokens from "../../utils/createNewSteppedSpacingTokens";
import {
  spacingStepBaseOptions,
  SpacingStepMetrics,
  spacingSteps,
  SpacingStepTypes
} from "../../utils/spacingStepping";
import "./spacingFirstRun.css";

export default class SpacingFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name || 'Spacing',
      baseName: 'spacing',
      baseSpaceSize: undefined,
      spaceStepsType: SpacingStepTypes.none,
      spaceStepsBaseMetrics: undefined
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string | undefined,
    baseSpaceSize?: number,
    spaceStepsType: SpacingStepTypes,
    spaceStepsBaseMetrics: SpacingStepMetrics | undefined,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Spacing Tokens" />
        <Input
          label="Name"
          value={this.state.name}
          onEnterOrBlur={(name: string) => {
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
        {(
          this.state.spaceStepsType !== SpacingStepTypes.spacingGroup &&
          this.state.spaceStepsType !== SpacingStepTypes.none
        ) ? (<>
          <Input
            label="Token Prefix (each token will begin with this)"
            value={this.state.baseName}
            onEnterOrBlur={(baseName: string) => {
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
            onEnterOrBlur={(baseSpaceSize: string) => {
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
        </>) : ''}
        <Select
          label="Step Pattern"
          value={this.state.spaceStepsType}
          dropdown={spacingSteps}
          onChange={(spaceStepsType: string) => {
            const newSpaceStepsBaseMetrics = spacingStepBaseOptions[spaceStepsType];
            this.setState({
              spaceStepsType,
              spaceStepsBaseMetrics: newSpaceStepsBaseMetrics ?
                {...newSpaceStepsBaseMetrics} : undefined,
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
        {(
          this.state.spaceStepsBaseMetrics &&
          this.state.spaceStepsType === SpacingStepTypes.tshirtSizes
        ) ? (
          <Select
              label="Base Spacing Step"
              value={this.state.spaceStepsBaseMetrics.default}
              dropdown={this.state.spaceStepsBaseMetrics.options}
              onChange={(value: string) => {
                this.setState({
                  spaceStepsBaseMetrics: {
                    ...this.state.spaceStepsBaseMetrics,
                    default: value
                  },
                });
              }}
              validation={
                this.validator.register(
                  'stepPattern',
                  () => {
                    return {
                      success: this.state.spaceStepsBaseMetrics?.default ?
                        true : false,
                      message: 'A spacing base step type is required'
                    }
                  }
                )
              }>
            </Select>) : null }
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.state.name || !this.props.tokenGroup) return;

            if (this.state.spaceStepsType === SpacingStepTypes.spacingGroup) {
              // build an empty tokenset and tokengroup and let list build groups
              const tokenset: DSysSpacingTokenset = {
                $extensions: {
                  'dsys.level': DSysLevel.tokenset,
                  'dsys.type': DSysGroupType.Spacing,
                  "dsys.name": this.state.name,
                  "dsys.nodeId": '?'
                },
                $description: 'a set of spacing tokens',
              }
              const finalTokenGroup = {
                ...this.props.tokenGroup,
                name: this.state.name,
                tokensets: [tokenset]
              };
              this.props.updateTokenGroup(finalTokenGroup);
              this.props.refreshTokens();
              return;
            }

            if (this.validator.validate().length === 0 ) {
              createNewSteppedSpacingTokens(
                this.state.baseName,
                this.state.baseSpaceSize,
                this.state.spaceStepsBaseMetrics,
                this.props.tokenGroup,
                this.props.updateTokenGroup,
              )
            }
          }}></DTButton>
      </div>
    );
  }
}
