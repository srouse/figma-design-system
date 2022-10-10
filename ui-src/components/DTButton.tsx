import React from "react";
import "./DTButton.css";
import {
  colors,
  getIcon,
  Icons
} from '../../shared/index';

export enum DTButtonColor {
  primary = 'primary',
  grey = 'grey',
} 

export enum DTButtonDesign {
  solid = 'solid',
  border = 'border',
} 

interface DTButtonProps {
  label: string,
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  design?: DTButtonDesign,
  color?: DTButtonColor,
  icon?: Icons,
  className?: string,
  style?: object
}

export default class DTButton extends React.Component<DTButtonProps> {

  constructor(props: DTButtonProps | Readonly<DTButtonProps>) {
    super(props);
  }

  render() {
    if (this.props.icon) {
      let color = colors.greyDark;
      if (this.props.design === DTButtonDesign.border) {
        if (this.props.color === DTButtonColor.grey) {
          color = colors.greyDark;
        }else{
          color = colors.primary;
        }
      }else{
        color = colors.white;
      }
      const iconSvg = getIcon(this.props.icon, color);
      return (
        <button
          className={`
            ${this.props.className || ''}
            ${this.props.design || DTButtonDesign.solid}
            ${this.props.color || DTButtonColor.primary}
            dtbutton useIcon`}
          style={this.props.style || {}}
          onClick={this.props.onClick}>
          <div className="icon"
            dangerouslySetInnerHTML={{__html: iconSvg}}></div>
          <div className="label">{this.props.label}</div>
        </button>
      );
    }

    return (
      <button
        className={`
          ${this.props.className || ''}
          ${this.props.design || DTButtonDesign.solid}
          ${this.props.color || DTButtonColor.primary}
          dtbutton`}
        style={this.props.style || {}}
        onClick={this.props.onClick}>
        <div className="label">{this.props.label}</div>
      </button>
    );
  }
}