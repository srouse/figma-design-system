import React from "react";
import "./input.css";

interface InputProps {
  label: string,
  value: string | undefined,
  onChange: (value: string) => void
  className?: string
}

export default class Input extends React.Component <InputProps> {

  constructor(props: InputProps | Readonly<InputProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`${this.props.className} comp-input`}>
        <div className="comp-label">{this.props.label}</div>
        <input onChange={(evt: any) => {
            this.props.onChange(evt.target.value);
          }}
          value={this.props.value}>
        </input>
      </div>
    );
  }
}

