import React from "react";
import {
  CoreProps,
  MessageRequest,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";
import createSteppedTokens from "../../utils/createSteppedTokens";
import {
  ColorStepTypes,
  StepsInformation,
  getStep9OneDigitInfo,
  getStep9TwoDigitInfo,
  getLightestStepsInfo,
  getColorGroupInfo,
  getStep9ThreeDigitInfo,
} from "../../utils/getStepsArray";
import "./colorFirstRun.css";

export default class FirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    const config = this.procesStepsInfoConfig();
    this.state = {
      name: this.props.tokenGroup?.name,
      stepsType: config.stepsType as ColorStepTypes,
      steps: config.steps,
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    stepsType: ColorStepTypes,
    baseColor?: string,
    steps: string,
  }

  procesStepsInfoConfig() {
    // figure out local state from steps...
    let newStepsTypes = ColorStepTypes.none;
    let stepsStr = getStep9TwoDigitInfo().steps;
    if (this.props.tokenGroup?.steps) {
      const steps = this.props.tokenGroup.steps;
      stepsStr = steps;
      if ( stepsStr === getStep9OneDigitInfo().steps ) {
        newStepsTypes = ColorStepTypes.step9OneDigit;
      }else if ( stepsStr === getStep9TwoDigitInfo().steps ) {
        newStepsTypes = ColorStepTypes.step9TwoDigit;
      }else if ( stepsStr === getStep9ThreeDigitInfo().steps ) {
        newStepsTypes = ColorStepTypes.step9ThreeDigit;
      }else{
        newStepsTypes = ColorStepTypes.colorGroup;
      }
    }
    return {
      stepsType: newStepsTypes,
      steps: stepsStr,
    }
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Color Tokens" />
        <Input
          label="Token Name"
          value={this.state.name}
          onEnterOrBlur={(name: string) => {
            this.setState({name});
          }} />{/*
          onValidate={
            this.validator.register(() => {
              return {
                success: this.state.name ? true : false,
                message: this.state.name ? '' : 'Name is required'
              }
            })
          } />*/}
        {(
          this.state.stepsType !== ColorStepTypes.colorGroup &&
          this.state.stepsType !== ColorStepTypes.none
        ) ? (
          <Input
            label="Center Color (hex #ff0000)"
            value={this.state.baseColor}
            helpText="Color at the center of the steps that determines all others"
            onEnterOrBlur={(baseColor: string) => {
              this.setState({baseColor});
            }}
            />
        ) : ''}
        {/*
        onValidateBlur={
          this.validator.register(() => {
            const isValidColor = validColor(this.state.baseColor);
            return {
              success: isValidColor,
              message: isValidColor ? '' : 'Must be a color'
            }
          })
        } />*/}
        <Select
          label="Step Pattern"
          value={this.state.stepsType}
          dropdown={[
            {
              name: 'Choose a Step Pattern',
              value: ColorStepTypes.none,
            },
            {
              name: 'Stepped 1, 2,..., 9',
              value: ColorStepTypes.step9OneDigit
            },
            {
              name: 'Stepped 10, 20,..., 90',
              value: ColorStepTypes.step9TwoDigit
            },
            {
              name: 'Stepped 100, 200,..., 900',
              value: ColorStepTypes.step9ThreeDigit
            },
            {
              name: 'Lightest to Darkest',
              value: ColorStepTypes.stepLightestToDarkest
            },
            {
              name: 'Color Group',
              value: ColorStepTypes.colorGroup
            },
          ]}
          onChange={(stepsType: string) => {
            let stepsInfo : StepsInformation | undefined;
            if (stepsType === ColorStepTypes.stepLightestToDarkest) {
              stepsInfo = getLightestStepsInfo();
            }else if (stepsType === ColorStepTypes.step9OneDigit) {
              stepsInfo = getStep9OneDigitInfo();
            }else if (stepsType === ColorStepTypes.step9TwoDigit) {
              stepsInfo = getStep9TwoDigitInfo();
            }else if (stepsType === ColorStepTypes.step9ThreeDigit) {
              stepsInfo = getStep9ThreeDigitInfo();
            }else if (stepsType === ColorStepTypes.colorGroup) {
              stepsInfo = getColorGroupInfo();
              this.setState({baseColor: '#eeeeee'});
            }
            this.setState({
              stepsType : stepsType,
              steps: stepsInfo?.steps || undefined
            });
          }}>
          {/* onValidate={
            this.validator.register(() => {
              const valid = this.state.stepsType !== 'none';
              return {
                success: valid,
                message: valid ? '' : 'Step pattern is required'
              }
            })
          } */}
        </Select>
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (
              !this.state.baseColor ||
              !this.state.name ||
              !this.props.tokenGroup
            ) {
              postMessagePromise(
                MessageRequest.notify,
                {
                  message: 'did not find basecolor, name or tokengroup',
                  error: true,
                }
              )
              return;
            }

            createSteppedTokens(
              this.state.steps,
              this.state.baseColor || '#eeeeee',
              this.state.name,
              this.props.tokenGroup,
              this.props.updateTokenGroup,
            ).then(result => console.log('create color step results', result));
          }}></DTButton>
      </div>
    );
  }
}
