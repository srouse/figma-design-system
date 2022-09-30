import React from "react";
import "./colorsUI.css";
import { CoreProps, MessageRequest } from "../../../shared/types/types";
import postMessagePromise from "../../utils/postMessagePromise";
import firstRun from "./firstRun";

export default class ColorsUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    postMessagePromise(
      MessageRequest.getColorStyles
    ).then((results: any) => {
      console.log('colors ui', results);
      this.setState({
        colorStyles: results.paint,
      })
    });
  }

  state: {
    colorStyles?: any,
    page: 'firstPage' | 'chooseSteps' | 'pullFromStyles' | 'steps'
  } = {
    page: 'firstPage',
  };

  render() {
    console.log(this.props.tokenGroup)
    return (
      <div
        className="colors"
        style={this.props.style}>
        {firstRun()}
      </div>
    );
  }

}
