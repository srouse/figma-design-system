import React from "react";
import { DSysTypographyToken } from "../../../../../shared";
import Input from "../../../../components/Input";
import { FontWithStyles } from "../typographyList";
import "./TypographyDetail.css";
import Select from "../../../../components/Select";

interface TypographyDetailProps {
  token?: DSysTypographyToken,
  fonts: FontWithStyles[]
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
    

    return (
      <div className={`typography-detail`}>
        <Select
          label="Font Family"
          value={this.props.token.$value.fontFamily}
          dropdown={fonts} />
        <Select
          label="Font Style"
          value={this.props.token.$value.fontStyle}
          dropdown={fontStyles} />
        <div className="typography-detail-row">
          <Input
            label="Font Size"
            value={`${this.props.token.$value.fontSize}`}
            onChange={(evt) => console.log(evt)} />
          <Input
            label="Font Weight"
            value={`${this.props.token.$value.fontWeight}`}
            onChange={(evt) => console.log(evt)} />
        </div>
        <div className="typography-detail-row">
          <Input
            label="Letter Spacing"
            value={`${this.props.token.$value.letterSpacing}`}
            onChange={(evt) => console.log(evt)} />
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
      </div>
    );
  }
}

