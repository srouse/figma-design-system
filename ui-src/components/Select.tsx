import React, { ChangeEvent } from "react";
import "./Select.css";

interface SelectProps {
  label: string,
  value: string | undefined,
  feedbackValue?: string | undefined,
  onChange?: (value: string) => void
  background?: 'light' | 'dark',
  className?: string,
  readOnly? : boolean,
  centerIcon? : boolean,
  dropdown: {value:string, name: string}[],
}

export default class Select extends React.Component<SelectProps> {

  constructor(props: SelectProps | Readonly<SelectProps>) {
    super(props);
    this.uid = `${Math.round(Math.random() * 1000000)}`;
  }

  uid: string;

  render() {
    return (
      <div className={`
        ${this.props.className}
        ${this.props.background}
        ${this.props.centerIcon ? 'center-icon' : ''}
        selectComp`}>
        <div className="selectComp-label">{this.props.label}</div>
        <div className="selectComp-select-box">
          {this.props.readOnly ? (
              <div className="selectComp-readonly">
                {this.props.value}
              </div>
            ) : (<>
              <select
                className="selectComp-select" 
                value={this.props.value}
                onChange={(evt: any) => {
                  if (this.props.onChange)
                    this.props.onChange(evt.target.value);
                }}>
                {this.props.dropdown.map(dropdown => {
                  return (
                    <option
                      value={dropdown.value} 
                      key={`dropdown_${this.uid}_${dropdown.value}`}>
                      {dropdown.name}
                    </option> 
                  );
                })}
              </select>
              <svg
                className="selectComp-icon"
                width="8" height="4"
                viewBox="0 0 8 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="8" height="1" fill="#999999"/>
                <rect y="3" width="8" height="1" fill="#999999"/>
              </svg>
            </>)
          }
          <div className="selectComp-feedback-value">
            {this.props.feedbackValue}
          </div>
        </div>
      </div>
    );
  }
}

