import React from "react";
import { DSysTypographyToken } from "../../../../../shared";
import Input from "../../../../components/Input";
import { FontWithStyles } from "../typographyList";
import "./TypographyDetail.css";
import Select from "../../../../components/Select";
import typeIframeContent from "../utils/TypeIframeContent";

interface TypographyDetailProps {
  token?: DSysTypographyToken,
  fonts: FontWithStyles[],
  updateToken: (token: DSysTypographyToken) => void
}

export default class TypographyDetail extends React.Component<TypographyDetailProps> {

  constructor(props: TypographyDetailProps | Readonly<TypographyDetailProps>) {
    super(props);
    this.state = {
      fontFamilies: this._getFontSelectorValues(),
      fontStyles: this._updateStyles(
        this.props.token?.$value.figmaFontObj.family
      ),
    }
  }

  componentDidUpdate(prevProps: Readonly<TypographyDetailProps>): void {
    if (prevProps.fonts !== this.props.fonts) {
      this.setState({
        fontFamilies: this._getFontSelectorValues(),
        fontStyles: this._updateStyles(
          this.props.token?.$value.figmaFontObj.family
        ),
      });
    }    
  }

  _getFontSelectorValues() {
    const fonts = this.props.fonts.map(font => {
      return {value:font.family, name: font.family};
    });
    fonts.unshift({name:'Choose a Family',value: ''});
    return fonts;
  }

  _updateStyles(
    fontFamily:string | undefined,
    updateState: boolean = false
  ) {
    if (!fontFamily) return [];
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
    if (updateState) {
      this.setState({fontStyles});
    }
    return fontStyles;
  }

  state: {
    fontFamilies: {name:string, value:string}[];
    fontStyles: {name:string, value:string}[]; 
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    const token = this.props.token as DSysTypographyToken;
    return (
      <div className={`typography-detail`}>
        <div className="typography-detail-row">
          <Select
            label="Family"
            className="typography-detail-font-family"
            value={this.props.token.$value.figmaFontObj.family}
            dropdown={this.state.fontFamilies}
            onChange={(value) => {
              const styles = this._updateStyles(value, true);
              let regular = styles.find(style => {
                return style.name === 'Regular' || style.name === 'Normal'
              });
              const finalStyle = regular ? regular.value : styles[0].value;
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  figmaFontObj: {
                    family: value,
                    style: finalStyle,
                  },
                }
              });
            }} />
          <Select
            label="Style"
            className="typography-detail-font-style"
            value={this.props.token.$value.figmaFontObj.style}
            dropdown={this.state.fontStyles}
            onChange={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  figmaFontObj: {
                    ...token.$value.figmaFontObj,
                    style: value,
                  },
                }
              });
            }} />
          <Input
            label="Size"
            className="typography-detail-font-size"
            value={`${token.$value.fontSize}`}
            type="number"
            selectAllOnFocus={true}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              const finalValue = parseInt(value) + increment;
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  fontSize: finalValue,
                }
              }); 
            }}
            onEnterOrBlur={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  fontSize: parseInt(value),
                }
              });
            }} />
        </div>
        <div className="typography-detail-row">
          <Input
            label="Letter Spacing"
            value={`${this.props.token.$value.letterSpacing.value}`}
            type="number"
            selectAllOnFocus={true}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              const finalValue = parseInt(value) + increment;
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  letterSpacing: {
                    ...token.$value.letterSpacing,
                    value: finalValue,
                  }
                }
              }); 
            }}
            onEnterOrBlur={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  letterSpacing: {
                    ...token.$value.letterSpacing,
                    value: parseInt(value),
                  },
                }
              });
            }} />
          <Select
            label="Unit"
            className="typography-detail-letter-spacing-unit"
            value={this.props.token.$value.letterSpacing.unit}
            dropdown={[
              {value:'PERCENT', name: '%'},
              {value:'PIXELS', name: 'px'},
            ]}
            onChange={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  letterSpacing: {
                    ...token.$value.letterSpacing,
                    unit: value as any,
                  },
                }
              });
            }} />
          <Input
            label="Line Height"
            value={`${
              (this.props.token.$value.lineHeight as any).value ?
                (this.props.token.$value.lineHeight as any).value.toFixed(2) : '' 
            }`}
            placeholder={`${
              (this.props.token.$value.lineHeight as any).value ? 
                '' : 'Auto'}`}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              let finalValue = 0;
              if (token.$value.lineHeight.unit === 'AUTO') {
                finalValue = (token.$value.fontSize*1.33) + increment;
              }else{
                finalValue = parseFloat(value) + increment;
              }
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  lineHeight: {
                    unit: token.$value.lineHeight.unit === 'AUTO' ? 
                      'PIXELS' : token.$value.lineHeight.unit,
                    value: Math.max(0, finalValue),
                  }
                }
              }); 
            }}
            onEnterOrBlur={(value) => {
              if (!value) {
                this.props.updateToken({
                  ...token,
                  $value: {
                    ...token.$value,
                    lineHeight: {
                      unit: 'AUTO',
                    },
                  }
                });
                return;
              }
              let lineHeightUnit = token.$value.lineHeight.unit;
              if (token.$value.lineHeight.unit === 'AUTO') {
                lineHeightUnit = 'PIXELS';
              }
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  lineHeight: {
                    unit: lineHeightUnit,
                    value: parseInt(value),
                  },
                }
              });
            }} />
          <Select
            label="Unit"
            className="typography-detail-line-height-unit"
            value={this.props.token.$value.lineHeight.unit}
            dropdown={[
              {value:'PERCENT', name: '%'},
              {value:'PIXELS', name: 'px'},
              {value:'AUTO', name: 'auto'},
            ]}
            onChange={(value) => {
              if (value === 'AUTO') {
                this.props.updateToken({
                  ...token,
                  $value: {
                    ...token.$value,
                    lineHeight: {
                      unit: 'AUTO',
                    },
                  }
                });
                return;
              }
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  lineHeight: {
                    ...token.$value.lineHeight,
                    unit: value as any,
                  },
                }
              });
            }} />
        </div>
        <div className="typography-detail-row">
          <Select
            label="Text Case"
            className="typography-detail-text-case"
            value={this.props.token.$value.textCase}
            dropdown={[
              {value:'ORIGINAL', name: 'Orginal'},
              {value:'UPPER', name: 'Uppercase'},
              {value:'LOWER', name: 'Lowercase'},
              {value:'TITLE', name: 'Title Case'},
            ]}
            onChange={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  textCase: value as any
                }
              });
            }} />
          <Select
            label="Text Decoration"
            className="typography-detail-text-decoration"
            value={this.props.token.$value.textDecoration}
            dropdown={[
              {value:'NONE', name: 'None'},
              {value:'UNDERLINE', name: 'Underline'},
              {value:'STRIKETHROUGH', name: 'Strikethrough'},
            ]}
            onChange={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  textDecoration: value as any
                }
              });
            }} />
        </div>
        <div style={{flex: 1}}></div>
        <iframe
          className="typography-detail-example"
          srcDoc={typeIframeContent(
            this.props.token,
            'Quick zephyrs blow, vexing daft Jim.',
            60,
            20,
          )}>
        </iframe>
      </div>
    );
  }
}

