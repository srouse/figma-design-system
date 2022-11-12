import React from "react";
import {
  CoreProps,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import {
  ColorStepMetrics,
  ColorStepTypes,
  ColorSteps,
  ColorStepBaseOptions,
} from "../../utils/colorStepping";
import createSteppedTokens from "../../utils/createSteppedTokens";
import "./colorFirstRun.css";

export default class FirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name,
      baseName: '',
      baseColor: undefined,
      colorStepsType: ColorStepTypes.none,
      colorStepsBaseMetrics: undefined
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string,
    baseColor: string | undefined,
    colorStepsType: ColorStepTypes,
    colorStepsBaseMetrics: ColorStepMetrics | undefined,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Color Tokens" />
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
          this.state.colorStepsType !== ColorStepTypes.colorGroup &&
          this.state.colorStepsType !== ColorStepTypes.none
        ) ? (
          <Input
            label="Base Color"
            value={this.state.baseColor}
            placeholder="#00ff00"
            helpText="Color at the center of the steps that determines all others"
            onEnterOrBlur={(baseColor: string) => {
              this.setState({baseColor});
            }}
            validation={
              this.validator.register(
                'baseColor',
                () => {
                  let success = false;
                  if (this.state.baseColor) {
                    const reg=/^#([0-9a-f]{3}){1,2}$/i;
                    success = reg.test(this.state.baseColor);
                  }
                  return {
                    success,
                    message: 'Need a valid base color to create tokens.'
                  }
                }
              )
            }
            />
        ) : ''}
        <Select
          label="Step Pattern"
          value={this.state.colorStepsType}
          dropdown={ColorSteps}
          onChange={(colorStepsType: string) => {
            const newColorStepsBaseMetrics = 
              ColorStepBaseOptions[colorStepsType];
            this.setState({
              colorStepsType,
              colorStepsBaseMetrics: newColorStepsBaseMetrics ?
                {...newColorStepsBaseMetrics} : undefined,
            })
          }}
          validation={
            this.validator.register(
              'stepPattern',
              () => {
                return {
                  success: this.state.colorStepsType !== ColorStepTypes.none,
                  message: 'A color step type is required'
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
            if (!this.state.name || !this.props.tokenGroup) return;

            if (this.state.colorStepsType === ColorStepTypes.colorGroup) {
              const finalTokenGroup = {
                ...this.props.tokenGroup,
                name: this.state.name,// just the name so we can build from styles
              };
              this.props.updateTokenGroup(finalTokenGroup);
              this.props.refreshTokens();
              return;
            }

            if (
              this.validator.validate().length === 0 &&
              this.state.baseColor
            ) {
              createSteppedTokens(
                this.state.name,
                this.state.baseColor,
                this.state.colorStepsBaseMetrics,
                this.props.tokenGroup,
                this.props.refreshTokens,
                this.props.updateTokenGroup,
              );
            }
          }}></DTButton>
      </div>
    );
  }
}
