import React from "react";
import {
  CoreProps,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import ColorPicker from "../../components/SingleColorPicker";
import {
  ColorStepMetrics,
  ColorStepTypes,
  ColorSteps,
  ColorStepBaseOptions,
} from "../../utils/colorStepping";
import createSteppedTokens from "../../utils/createSteppedTokens";
import "./colorFirstRun.css";
import * as mixpanel from '../../../../utils/mixpanel';

export default class FirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name,
      baseName: '',
      baseColor: '#ff0000',
      colorStepsType: ColorStepTypes.none,
      colorStepsBaseMetrics: undefined
    }
    this.validator = new Validator();
    mixpanel.track(`firstRun-${props.tokenGroup?.type}`);
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseName: string,
    baseColor: string,
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
        {(
          this.state.colorStepsType !== ColorStepTypes.colorGroup &&
          this.state.colorStepsType !== ColorStepTypes.none
        ) ? (<>
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
          <ColorPicker
            color={this.state.baseColor}
            style={{flex: 1, marginBottom: '10px'}}
            onColorChange={(color: string) => {
              this.setState({
                baseColor: color,
              })
            }}>
          </ColorPicker>
        </>) : (<div style={{flex: 1}}></div>)}
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.props.tokenGroup) return;
            if (this.validator.validate().length === 0) {
              if (this.state.colorStepsType === ColorStepTypes.colorGroup) {
                const finalTokenGroup = {
                  ...this.props.tokenGroup,
                  // just the name so we can build from styles
                  name: this.state.name,
                };
                this.props.updateTokenGroup(finalTokenGroup);
                this.props.refreshTokens();
                return;
              }
              createSteppedTokens(
                this.state.name!,
                this.state.baseColor!,
                this.state.colorStepsBaseMetrics,
                this.props.tokenGroup,
                this.props.updateTokenGroup,
              );
              mixpanel.track(`createSet-${this.props.tokenGroup?.type}`,
                {
                  name: this.state.name,
                  baseColor: this.state.baseColor,
                  colorStepsType: this.state.colorStepsType
                }
              );
            }
          }}></DTButton>
      </div>
    );
  }
}
