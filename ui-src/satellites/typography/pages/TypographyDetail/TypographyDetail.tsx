import React, { KeyboardEvent } from "react";
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
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    let fontStyles: {value:string, name:string}[] = [];
    const fonts = this.props.fonts.map(font => {
      if (this.props.token?.$value.fontFamily === font.family) {
        fontStyles = font.styles.map(style => {
          return {value:style, name: style};
        });
      }
      return {value:font.family, name: font.family};
    });

    const token = this.props.token as DSysTypographyToken;
    return (
      <div className={`typography-detail`}>
        <div className="typography-detail-row">
          <Select
            label="Font Family"
            value={this.props.token.$value.figmaFontObj.family}
            dropdown={fonts} />
          <Select
            label="Font Style"
            value={this.props.token.$value.figmaFontObj.style}
            dropdown={fontStyles} />
        </div>
        <div className="typography-detail-row">
          <Input
            label="Font Size"
            value={`${token.$value.fontSize}`}
            onArrowUpOrDown={(
              value: string,
              direction: 'up' | 'down',
              evt: KeyboardEvent<HTMLInputElement>
            ) => {
              let increment = evt.shiftKey ? 10 : 1;
              if (direction === 'down') {
                increment = increment * -1;
              }
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
          {/*<Input
            label="Font Weight"
            value={`${this.props.token.$value.fontWeight}`}
            onChange={(evt) => console.log(evt)} />*/}
          <Input
            label="Letter Spacing"
            value={`${this.props.token.$value.letterSpacing}px`}
            onArrowUpOrDown={(
              value: string,
              direction: 'up' | 'down',
              evt: KeyboardEvent<HTMLInputElement>
            ) => {
              let increment = evt.shiftKey ? 10 : 1;
              if (direction === 'down') {
                increment = increment * -1;
              }
              const finalValue = parseInt(value) + increment;
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  letterSpacing: finalValue,
                }
              }); 
            }}
            onEnterOrBlur={(value) => {
              this.props.updateToken({
                ...token,
                $value: {
                  ...token.$value,
                  letterSpacing: parseInt(value),
                }
              });
            }} />
          <Input
            label="Line Height"
            value={`${this.props.token.$value.lineHeight}`}
            onChange={(evt) => console.log(evt)} />
        </div>
        <div className="typography-detail-row">
          <Input
            label="Text Case"
            value={`${this.props.token.$value.textCase}`}
            onChange={(evt) => console.log(evt)} />
          <Input
            label="Text Decoration"
            value={`${this.props.token.$value.textDecoration}`}
            onChange={(evt) => console.log(evt)} />
        </div>
        <div style={{flex: 1}}></div>
        <iframe
          className="typography-detail-example"
          srcDoc={typeIframeContent(
            this.props.token,
            'Quick zephyrs blow, vexing daft Jim.',
            60
          )}>
        </iframe>
      </div>
    );
  }
}

