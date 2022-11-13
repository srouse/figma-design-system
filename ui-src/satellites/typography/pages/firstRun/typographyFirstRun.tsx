import React from "react";
import {
  CoreProps,
  DTTokenType,
  Validator,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import { FontWithStyles } from "../typographyList";
import createSteppedTypographyTokens from "../utils/createSteppedTypographyTokens";
import typeIframeContent from "../utils/TypeIframeContent";
import {
  TypographyStepBaseOptions,
  TypographyStepMetrics,
  TypographySteps,
  TypographyStepTypes
} from "../utils/typographyStepping";
import "./TypographyFirstRun.css";

interface TypographyProps extends CoreProps {
  fonts: FontWithStyles[]
}

export default class FirstRun extends React.Component<TypographyProps> {

  constructor(props: TypographyProps | Readonly<TypographyProps>) {
    super(props);
    this.state = {
      name: this.props.tokenGroup?.name,
      baseFontFamily: undefined,
      baseFontStyle: undefined,
      baseSize: 16,
      typographyStepsType: TypographyStepTypes.none,
      typographyStepsBaseMetrics: undefined,
      fontFamilies: this._getFontSelectorValues(),
      fontStyles: undefined,
    }
    this.validator = new Validator();
  }

  componentDidUpdate(prevProps: Readonly<TypographyProps>): void {
    if (prevProps.fonts !== this.props.fonts) {
      this.setState({fontFamilies: this._getFontSelectorValues()});
    }    
  }

  _getFontSelectorValues() {
    const fonts = this.props.fonts.map(font => {
      return {value:font.family, name: font.family};
    });
    fonts.unshift({name:'Choose a Family', value: ''});
    return fonts;
  }

  validator: Validator;

  state: {
    name: string | undefined,
    baseFontFamily: string | undefined,
    baseFontStyle: string | undefined,
    baseSize: number,
    typographyStepsType: TypographyStepTypes,
    typographyStepsBaseMetrics: TypographyStepMetrics | undefined,
    fontFamilies: {name:string, value:string}[];
    fontStyles: {name:string, value:string}[] | undefined; 
  }

  updateStyles(fontFamily:string) {
    let fontStyles: {value:string, name:string}[] = [];
    this.props.fonts.find(font => {
      if (fontFamily === font.family) {
        fontStyles = font.styles.map(style => {
          return {value:style, name: style};
        });
        return true;
      }
      return false;
    });
    fontStyles.unshift({name:'Choose a Style', value: ''});
    let regular = fontStyles.find(style => {
      return style.name === 'Regular' || style.name === 'Normal'
    });
    const finalStyle = regular ? regular.value : fontStyles[0].value;
    this.setState({
      fontStyles,
      baseFontStyle: finalStyle,
    });
    return fontStyles;
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
          value={this.state.typographyStepsType}
          dropdown={TypographySteps}
          onChange={(typographyStepsType: string) => {
            const newTypographyStepsBaseMetrics = 
              TypographyStepBaseOptions[typographyStepsType];
            this.setState({
              typographyStepsType,
              typographyStepsBaseMetrics: newTypographyStepsBaseMetrics ?
                {...newTypographyStepsBaseMetrics} : undefined,
            })
          }}
          validation={
            this.validator.register(
              'stepPattern',
              () => {
                return {
                  success: this.state.typographyStepsType !== 
                    TypographyStepTypes.none,
                  message: 'A color step type is required'
                }
              }
            )
          }>
        </Select>
        {(
          this.state.typographyStepsType !== TypographyStepTypes.typographyGroup &&
          this.state.typographyStepsType !== TypographyStepTypes.none
        ) ? (<>
          <div className="typography-first-run-row">
            <Select
              label="Font Family"
              className="typography-detail-font-family"
              value={this.state.baseFontFamily}
              dropdown={this.state.fontFamilies}
              onChange={(value) => {
                this.updateStyles(value);
                this.setState({
                  baseFontFamily: value,
                });
              }}
              validation={
                this.validator.register(
                  'family',
                  () => {
                    return {
                      success: this.state.baseFontFamily ? true : false,
                      message: 'Font Family is required'
                    }
                  }
                )
              } />
              {(
                this.state.fontStyles && this.state.baseFontFamily
              ) ? (
                <Select
                  label="Font Style"
                  className="typography-detail-font-family"
                  value={this.state.baseFontStyle}
                  dropdown={this.state.fontStyles}
                  onChange={(value) => {
                    this.setState({
                      baseFontStyle: value,
                    });
                  }}
                  validation={
                    this.validator.register(
                      'style',
                      () => {
                        return {
                          success: this.state.baseFontStyle ? true : false,
                          message: 'Font Style is required'
                        }
                      }
                    )
                  } />
                ) : ''}
                <Input
                  label="Base Size"
                  className="typography-first-run-base-size"
                  value={`${this.state.baseSize}`}
                  onEnterOrBlur={(baseSize: string) => {
                    this.setState({baseSize: parseFloat(baseSize)});
                  }}
                  onArrowUpOrDown={(
                    baseSize: string,
                    increment: number,
                  ) => {
                    this.setState({baseSize: parseFloat(baseSize) + increment});
                  }}
                  validation={
                    this.validator.register(
                      'baseSize',
                      () => {
                        return {
                          success: this.state.baseSize ? true : false,
                          message: 'Base Size is required'
                        }
                      }
                    )
                  } />
                </div>
          </>) : ''}
        <div style={{flex: "1"}}></div>
        {this.state.baseFontFamily && this.state.baseFontStyle ? (
          <iframe
          className="typography-detail-example"
          srcDoc={typeIframeContent(
            {
              $value: {
                fontFamily: this.state.baseFontFamily || '',
                figmaFontObj : {
                  family: this.state.baseFontFamily || '',
                  style: this.state.baseFontStyle || '',
                },
                fontWeight: 400,
                fontStyle: this.state.baseFontStyle || '',
                fontSize: this.state.baseSize,
                letterSpacing: {value: 0, unit:'PIXELS'},
                lineHeight: {unit:'AUTO'},
                listSpacing: 0,
                paragraphIndent: 0,
                paragraphSpacing: 0,
                textCase: 'ORGINAL',
                textDecoration: 'NONE',
              },
              $type: DTTokenType.typography
            },
            'Quick zephyrs blow, vexing daft Jim.',
            60,
            20,
          )}>
        </iframe>
        ) : ''}
        <DTButton
          label="Create"
          className="typography-first-run-create-btn"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.props.tokenGroup) return;
            if (this.validator.validate().length === 0) {
              if (
                this.state.typographyStepsType === 
                TypographyStepTypes.typographyGroup
              ) {
                const finalTokenGroup = {
                  ...this.props.tokenGroup,
                  // just the name so we can build from style
                  name: this.state.name,
                };
                this.props.updateTokenGroup(finalTokenGroup);
                this.props.refreshTokens();
                return;
              }

              (async () => {
                await createSteppedTypographyTokens(
                  // we are past validator, so we know they are good
                  this.state.name,
                  this.state.baseFontFamily,
                  this.state.baseFontStyle,
                  this.state.baseSize,
                  this.state.typographyStepsBaseMetrics,
                  this.props.tokenGroup!,
                  this.props.updateTokenGroup,
                );
                this.props.refreshTokens();
              })()
            }
          }}></DTButton>
      </div>
    );
  }
}
