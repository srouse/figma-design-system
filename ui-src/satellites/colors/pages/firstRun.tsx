import React from "react";
import {
  CoreProps,
  MessageRequest,
  MessageRequestStyle,
  DTTokenType,
  DSysGroupType,
  DSysLevel,
  DSysTokenset,
  Validator,
} from "../../../../shared";
import Checkbox from "../../../components/Checkbox";
import DTButton, { DTButtonColor } from "../../../components/DTButton";
import Input from "../../../components/Input";
import InputHeader from "../../../components/InputHeader";
import Select from "../../../components/Select";
import postMessagePromise from "../../../utils/postMessagePromise";
import {
  get10StepsInfo,
  get10ColorStepsInfo,
  getCustomStepsInfo,
  getLightestStepsInfo,
  ColorStepTypes,
  getSingleColorInfo,
  StepsInformation,
} from "../utils/getStepsArray";
import stepBaseColor from "../utils/stepBaseColor";
import "./firstRun.css";

export default class FirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    const config = this.procesStepsInfoConfig();
    this.state = {
      name: this.props.tokenGroup?.name,
      stepsType: config.stepsType as ColorStepTypes | 'none',
      includeBlackAndWhite: config.includeBlackAndWhite,
      steps: config.steps,
    }
    this.validator = new Validator();
  }

  validator: Validator;

  state: {
    name: string | undefined,
    stepsType: ColorStepTypes | 'none',
    baseColor?: string,
    steps: string,
    includeBlackAndWhite: boolean
  }

  procesStepsInfoConfig() {
    // figure out local state from steps...
    let newStepsTypes = 'none';// ColorStepTypes.step10Step;
    let newIncludeBlackAndWhite = true;
    let stepsStr = get10StepsInfo().steps;
    if (this.props.tokenGroup?.steps) {
      const steps = this.props.tokenGroup.steps;
      stepsStr = steps;
      if (
        stepsStr === get10StepsInfo().steps 
      ) {
        newStepsTypes = ColorStepTypes.step10Step;
        newIncludeBlackAndWhite = get10StepsInfo().includeBlackAndWhite;
      }else if (
        stepsStr === get10ColorStepsInfo().steps
      ) {
        newStepsTypes = ColorStepTypes.step10StepColor;
        newIncludeBlackAndWhite = get10ColorStepsInfo().includeBlackAndWhite;
      }else if (
        stepsStr === getLightestStepsInfo().steps 
      ) {
        newStepsTypes = ColorStepTypes.stepLightestToDarkest;
        newIncludeBlackAndWhite = getLightestStepsInfo().includeBlackAndWhite;
      }else{
        newStepsTypes = ColorStepTypes.stepCustom;
        newIncludeBlackAndWhite = getCustomStepsInfo().includeBlackAndWhite;
      }
    }
    return {
      stepsType: newStepsTypes,
      includeBlackAndWhite: newIncludeBlackAndWhite,
      steps: stepsStr,
    }
  }

  getSteps() {
    switch (this.state.stepsType) {
      case ColorStepTypes.step10Step :
        return get10StepsInfo();
      case ColorStepTypes.step10StepColor :
        return get10ColorStepsInfo();
      case ColorStepTypes.stepLightestToDarkest :
        return getLightestStepsInfo();
      case ColorStepTypes.stepCustom :
        return [];
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
          onChange={(name: string) => {
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
        <Input
          label="Center Color (hex #ff0000)"
          value={this.state.baseColor}
          helpText="Color at the center of the steps that determines all others"
          onChange={(baseColor: string) => {
            this.setState({baseColor});
          }} />{/*
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
              value: 'none'
            },
            {
              name: '10 Step',
              value: ColorStepTypes.step10Step
            },
            {
              name: '10 Step - Color (no black or white)',
              value: ColorStepTypes.step10StepColor
            },
            {
              name: 'Lightest to Darkest',
              value: ColorStepTypes.stepLightestToDarkest
            },
            {
              name: 'Single Color',
              value: ColorStepTypes.stepSingleColor
            },
            {
              name: 'Custom',
              value: ColorStepTypes.stepCustom
            },
          ]}
          onChange={(stepsType: string) => {
            let stepsInfo : StepsInformation | undefined;
            if (stepsType === ColorStepTypes.step10Step) {
              stepsInfo = get10StepsInfo();
            }else if (stepsType === ColorStepTypes.stepLightestToDarkest) {
              stepsInfo = getLightestStepsInfo();
            }else if (stepsType === ColorStepTypes.step10StepColor) {
              stepsInfo = get10ColorStepsInfo();
            }else if (stepsType === ColorStepTypes.stepSingleColor) {
              stepsInfo = getSingleColorInfo();
            }else if (stepsType === ColorStepTypes.stepCustom) {
              stepsInfo = getCustomStepsInfo();
            }
            this.setState({
              stepsType : stepsType,
              steps: stepsInfo?.steps || undefined,
              includeBlackAndWhite: stepsInfo?.includeBlackAndWhite || false
            });
          }}
          onValidate={
            this.validator.register(() => {
              const valid = this.state.stepsType !== 'none';
              return {
                success: valid,
                message: valid ? '' : 'Step pattern is required'
              }
            })
          }>
        </Select>
        {this.state.stepsType === ColorStepTypes.stepCustom ? (<>
          <Input
            label="Custom Steps"
            value={this.state.steps}
            helpText="Comma deliminated. [base] is required, but only once. 
            Base can also have an additional step entry [base:step]. Entering
             [base:05] will create 'grey' and 'grey-05' with the base color.
            "
            onChange={(steps: string) => {
              this.setState({
                steps
              })
            }}
            validator={this.validator}
            onValidate={() => {
              return {
                success: this.state.steps ? false : false,
                message: this.state.steps ? '' : 'Steps are required'
              }
            }} />
            <Checkbox
              label="include black and white ( usually grey steps )"
              value={this.state.includeBlackAndWhite}
              onChange={(includeBlackAndWhite: boolean) => {
                this.setState({includeBlackAndWhite});
              }} />
          </>) : null}
        
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            const validation = this.validator.validateAll();
            if (validation.length > 0) {
              return;
            }

            const steps = this.state.steps.split(',');
            const results = stepBaseColor(
              this.state.baseColor,
              steps,
              this.state.includeBlackAndWhite,
            );
            if (!this.props.tokenGroup) return;

            const tg = this.props.tokenGroup;
            const newTokenSet : DSysTokenset = {
              $extensions: {
                'dsys.level': DSysLevel.tokenset,
                'dsys.type': DSysGroupType.ColorSet,
                'dsys.name': this.state.name || '',
                "dsys.nodeId": tg.nodeId,
              },
              $description:
                `Color tokens with the named ${this.state.name} and steps ${this.state.steps}`,
            };

            results.steps?.map((stepResult, index) => {
              if (stepResult.step === undefined) return;
              newTokenSet[stepResult.step] = {
                $extensions: {
                  'dsys.level'    : DSysLevel.token,
                  'dsys.name'     : stepResult.step,
                  'dsys.index'    : index,
                  'dsys.styleId'  : '',
                },
                $value: {
                  hex: stepResult.hex,
                  alpha: 1,
                },
                $type: DTTokenType.color
              };

              const name = this.state.name ? 
                this.state.name.toLowerCase() : '';
              const stepName = stepResult.step ?
                `-${stepResult.step.toLowerCase()}` : ''
              postMessagePromise(
                MessageRequest.createStyle,
                {
                  style: {
                    type: MessageRequestStyle.color,
                    name: `${name}/${name}${stepName}`,
                    value: stepResult,
                  }
                }
              );
            });

            this.props.updateTokenGroup({
              ...tg,
              name: this.state.name,
              tokensets: [newTokenSet]
            });
          }}></DTButton>
      </div>
    );
  }
}
