import React from "react";
import {
  CoreProps,
} from "../../shared/types/types";
import "./SatelliteHeaderUI.css";
import tokenGroupTypeToName from '../../shared/tokenGroupTypeToName';
import { DSysGroupType } from "../../shared/types/designSystemTypes";

export default class SatelliteHeaderUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {

    let title = this.props.tokenGroup?.name;
    let subtitle = tokenGroupTypeToName(this.props.tokenGroup);

    if (this.props.tokenGroup?.type === DSysGroupType.Base) {
      title = this.props.globalData?.fullName;
      subtitle = 'Design Tokens';
    }

    return (
      <div className="satellite-header">
        <div className="prefix">
          {this.props.globalData?.prefix}
        </div>
        <div className="groupSummary">
          <div className="name">
            {title}
          </div>
          <div className="type">
            {subtitle}
          </div>
        </div>
     </div>
    );
  }
}

