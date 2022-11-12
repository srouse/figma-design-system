import React from "react";
import "./typographyUI.css";
import { CoreProps, MessageRequest } from "../../../shared/types/types";
import TypographyFirstRun from "./pages/firstRun/typographyFirstRun";
import TypographyList, { FigmaFontLookup, FontWithStyles } from "./pages/typographyList";
import postMessagePromise from "../../utils/postMessagePromise";

export default class TypographyUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      fonts: [],
      fontLookup: {}
    }

    postMessagePromise(
      MessageRequest.getAvailableFonts
    ).then((results : any) => {
      const finalFonts: FontWithStyles[] = [];
      const fontLookup: {[key:string]: FontWithStyles} = {};
      (results.fonts as FigmaFontLookup[]).map((font) => {
        if (!fontLookup[font.fontName.family]) {
          fontLookup[font.fontName.family] = {
            family: font.fontName.family,
            styles: [font.fontName.style]
          };
          finalFonts.push(fontLookup[font.fontName.family]);
        }else{
          fontLookup[font.fontName.family].styles.push(font.fontName.style);
        }
      });
      this.setState({
        fonts: finalFonts,
        fontLookup
      })
    });
  }

  state : {
    fonts: FontWithStyles[],
    fontLookup: FigmaFontLookup,
  }

  render() {
    return (
      <div
        className="ui-list"
        style={this.props.style}>
        {this.renderPage()}
      </div>
    );
  }

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <TypographyFirstRun {...this.props} fonts={this.state.fonts} />
      );
    }else{
      return (
        <TypographyList {...this.props} fonts={this.state.fonts} />
      );
    }
  }
}