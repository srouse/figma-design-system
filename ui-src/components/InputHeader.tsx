import React from "react";
import "./InputHeader.css";

interface InputHeaderProps {
  label: string,
  background?: 'light' | 'dark',
  className?: string
}

export default class InputHeader extends React.Component<InputHeaderProps> {

  constructor(props: InputHeaderProps | Readonly<InputHeaderProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`
        ${this.props.className}
        inputHeader`}>
        <div className="inputHeader-label">
          {this.props.label}
        </div>
      </div>
    );
  }
}

