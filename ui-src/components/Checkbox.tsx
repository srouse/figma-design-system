import React from "react";
import "./Checkbox.css";

interface CheckboxProps {
  label: string,
  value: boolean,
  feedbackValue?: string | undefined,
  onChange?: (value: boolean) => void
  background?: 'light' | 'dark',
  className?: string,
  password? : boolean,
  readOnly? : boolean,
  hideLabel? : boolean,
}

export default class Checkbox extends React.Component<CheckboxProps> {

  constructor(props: CheckboxProps | Readonly<CheckboxProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`
        ${this.props.className}
        ${this.props.background}
        checkboxComp`}
        onClick={() => {
          if (this.props.onChange)
            this.props.onChange(!this.props.value);
        }}>
        <div className="checkboxComp-box">
          {this.props.readOnly ? (<>
              <div className="checkboxComp-label">
                {this.props.value ? '(yes) ' : '(no) '}
                {this.props.label}
              </div>
            </>) : (<>
              <button className="checkboxComp-checkbox">
                {this.props.value ? (
                  <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4072 1.81696L13.0112 0.0115163L6.39128 8.79651L2.3981 5.78743L0.592657 8.18334L4.58583 11.1924L6.98174 12.9979L8.78719 10.602L15.4072 1.81696Z" fill="#A164F9"/>
                  </svg>
                ) : null}
              </button>
              {this.props.hideLabel ? null : (
                <div className="checkboxComp-label">
                  {this.props.label}
                </div>
              )}
            </>)
          }
        </div>
        <div className="checkboxComp-feedback-value">
          {this.props.feedbackValue}
        </div>
      </div>
    );
  }
}

