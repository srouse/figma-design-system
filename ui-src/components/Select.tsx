import React, { ChangeEvent } from "react";
import { ValidatorRegistration } from "../../shared/validator/Validator";
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
  onValidate? : ValidatorRegistration,
  dropdown: {value:string, name: string}[],
}

export default class Select extends React.Component<SelectProps> {

  constructor(props: SelectProps | Readonly<SelectProps>) {
    super(props);
    this.uid = `${Math.round(Math.random() * 1000000)}`;
    this.state = {
      valid: true,
    };

    this.props.onValidate?.validator.registerComponent(
      this.uid,
      () => {
        if (!this.props.onValidate) return {success:true};
        const results = this.props.onValidate.validation();
        this.setState({valid: results.success});
        return results;
      }
    );
  }

  componentWillUnmount() {
    if (this.props.onValidate)
      this.props.onValidate.validator.unregister(this.uid);
  }

  uid: string;
  state : {
    valid: boolean,
  }

  render() {
    return (
      <div className={`
        ${this.props.className}
        ${this.props.background}
        ${this.props.centerIcon ? 'center-icon' : ''}
        ${this.state.valid ? 'valid' : 'invalid'}
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
                  
                  setTimeout(() => {
                    this.props.onValidate?.validator.validate(this.uid)
                  }, 0);
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

