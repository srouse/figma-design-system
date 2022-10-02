import React from "react";
import "./colorsUI.css";
import {
  CoreProps,
  MessageRequest,
} from "../../../shared/types/types";
import postMessagePromise from "../../utils/postMessagePromise";
import StepsPage from "./pages/stepsPage";
import EditColor from "./pages/editColor";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    postMessagePromise(
      MessageRequest.getColorStyles
    ).then((results: any) => {
      this.setState({
        colorStyles: results.paint,
      })
    });
  }

  state: {
    colorStyles?: any,
  } = {};

  render() {
    return (
      <div
        className="colors"
        style={this.props.style}>
        {this.renderPage()}
      </div>
    );
  }

  renderPage() {
    if (!this.props.tokenGroup?.name) {
      return (
        <StepsPage {...this.props} />
      );
    }else{
      return (
        <EditColor {...this.props} />
      );
    }
  }
}


