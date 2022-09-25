import React from "react";
import "./Input.css";

interface InputProps {
  label: string,
  value: string | undefined,
  feedbackValue?: string | undefined,
  onChange: (value: string) => void
  background?: 'light' | 'dark',
  className?: string
}

export default class Input extends React.Component<InputProps> {

  constructor(props: InputProps | Readonly<InputProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`
        ${this.props.className}
        ${this.props.background}
        inputComp`}>
        <div className="inputComp-label">{this.props.label}</div>
        <div className="inputComp-input-box">
          <input
            spellCheck="false"
            autoCapitalize="off"
            autoCorrect="off" 
            className="inputComp-input"
            onChange={(evt: any) => {
              this.props.onChange(evt.target.value);
            }}
            value={this.props.value}>
          </input>
          <div className="inputComp-feedback-value">
            {this.props.feedbackValue}
          </div>
        </div>
      </div>
    );
  }
}

