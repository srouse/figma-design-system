import React from "react";
import {
  CoreProps,
} from "../../shared/types/types";
import Input from "./Input";
import "./SatelliteHeaderUI.css";
import tokenGroupTypeToName from '../../shared/tokenGroupTypeToName';

export default class SatelliteHeaderUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() { 
    return (
      <div className="satellite-header">
        <div className="prefix">
          {this.props.globalData?.prefix}
        </div>
        <div className="groupSummary">
          <div className="name">
            {this.props.tokenGroup?.name}
          </div>
          <div className="type">
            {tokenGroupTypeToName(this.props.tokenGroup)}
          </div>
        </div>
     </div>
    );
  }
}

