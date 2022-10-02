import React from "react";
import "./InputHeader.css";

interface InputHeaderProps {
  label: string,
  background?: 'light' | 'dark',
  className?: string,
  linkLabel?: string,
  onLinkClick?: () => void,
}

export default class InputHeader extends React.Component<InputHeaderProps> {

  constructor(props: InputHeaderProps | Readonly<InputHeaderProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`
        ${this.props.className || ''}
        inputHeader`}>
        <div className="inputHeader-label">
          {this.props.label}
        </div>
        <div className="inputHeader-link"
          onClick={this.props.onLinkClick}>
          {this.props.linkLabel}
        </div>
      </div>
    );
  }
}

