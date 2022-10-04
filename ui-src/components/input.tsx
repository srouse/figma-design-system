import React from "react";
import "./Input.css";

interface InputProps {
  label: string,
  value: string | undefined,
  feedbackValue?: string | undefined,
  onChange?: (value: string) => void
  background?: 'light' | 'dark',
  className?: string,
  password? : boolean,
  readOnly? : boolean,
  hideLabel? : boolean,
  helpText? : string,
  textAlign? : 'left' | 'right' | 'center'
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
        {this.props.hideLabel ? null : (
          <div className="inputComp-label">
            {this.props.label}
          </div>
        )}
        <div className="inputComp-input-box">
          {this.props.readOnly ? (
              <div className="inputComp-readonly">
                {this.props.value}
              </div>
            ) : (
              <input
                spellCheck="false"
                autoCapitalize="off"
                autoCorrect="off" 
                className="inputComp-input"
                type={this.props.password ? 'password' : 'text'}
                style={{textAlign: this.props.textAlign || 'left'}}
                onChange={(evt: any) => {
                  if (this.props.onChange)
                    this.props.onChange(evt.target.value);
                }}
                value={this.props.value}>
              </input>
            )
          }
          {this.props.feedbackValue ? (
            <div className="inputComp-feedback-value">
              {this.props.feedbackValue}
            </div>
          ) : null }
          {this.props.helpText ? (
            <div className="inputComp-help-text">
              {this.props.helpText}
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

