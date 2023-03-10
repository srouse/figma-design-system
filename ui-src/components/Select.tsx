import React from "react";
import {
  ValidationLocation,
  ValidationWorker,
  ValidatorSuccess,
  SelectDropDown,
} from "../../shared";

import "./Select.css";

interface SelectProps {
  label: string,
  value: string | undefined,
  feedbackValue?: string | undefined,
  onChange?: (value: string, valueObj?: SelectDropDown | undefined) => void
  background?: 'light' | 'dark',
  className?: string,
  readOnly? : boolean,
  centerIcon? : boolean,
  cellDisplay? : boolean,
  dropdown: SelectDropDown[],
  validation?: ValidationWorker,
}

export default class Select extends React.Component<SelectProps> {

  constructor(props: SelectProps | Readonly<SelectProps>) {
    super(props);
    this.uid = `${Math.round(Math.random() * 1000000)}`;
    this.state = {
      valid: true,
      errorMessage: undefined,
    };
    this.addValidationSideEffects();
  }

  componentWillUnmount() {
    if (this.props.validation) {
      this.props.validation.unregister();
    }
  }

  componentDidUpdate(prevProps: Readonly<SelectProps>): void {
    this.addValidationSideEffects();
    if (prevProps.value !== this.props.value) {
      // just reset validation if value changes from outside
      this.setState({
        valid: true,
        errorMessage: undefined
      });
    }
  }

  addValidationSideEffects() {
    if (
      this.props.validation && 
      !this.props.validation.sideEffects
    ) {
      this.props.validation.sideEffects = (validationResults : ValidatorSuccess) => {
        this.setState({
          valid: validationResults.success,
          errorMessage: validationResults.success ? 
            '' : validationResults.message
        });
      }
    }
  }

  uid: string;
  state : {
    valid: boolean,
    errorMessage: string | undefined,
  }

  render() {
    return (
      <div className={`
        ${this.props.className || ''}
        ${this.props.background || ''}
        ${this.props.cellDisplay ? 'selectComp-cell-display' : ''}
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
                onFocus={() => {
                  this.setState({
                    errorMessage: undefined,
                    valid: true// just to reset during typing
                  });
                }}
                onBlur={() => {
                  if (this.props.validation) {
                    this.props.validation.validateOnLocation(
                      ValidationLocation.onValidateBlur
                    );
                  }
                }}
                onChange={(evt: any) => {
                  const value = evt.target.value;
                  let selectedValue: SelectDropDown | undefined; 
                  this.props.dropdown.find(valueObj => {
                    if (valueObj.children) {
                      valueObj.children.find(childValueObj => {
                        if (childValueObj.value === value) {
                          selectedValue = childValueObj;
                          return true;
                        }
                        return false;
                      })
                    }
                    if (valueObj.value === value) {
                      selectedValue = valueObj;
                      return true;
                    }
                    return false;
                  });
                  if (this.props.onChange)
                    this.props.onChange(value, selectedValue);

                  setTimeout(() => {
                    if (this.props.validation) {
                      this.props.validation.validateOnLocation(
                        ValidationLocation.onValidateChange
                      );
                    }
                  }, 0);
                }}>
                {this.props.dropdown.map(dropdown => {
                  if (dropdown.children) {
                    return (
                      <optgroup
                        label={dropdown.name}
                        key={`dropdown_${this.uid}_${dropdown.value}`}>
                        {dropdown.children.map(dropdownChild => {
                          return (
                            <option
                              value={dropdownChild.value} 
                              key={`dropdown_${this.uid}_${
                                  dropdown.value}_${
                                  dropdownChild.value}`}>
                              {dropdownChild.name}
                            </option> 
                          );
                        })}
                      </optgroup> 
                    );
                  }else{
                    return (
                      <option
                        value={dropdown.value} 
                        key={`dropdown_${this.uid}_${dropdown.value}`}>
                        {dropdown.name}
                      </option> 
                    );
                  }
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
          {this.props.feedbackValue ? (
            <div className="selectComp-feedback-value">
              {this.props.feedbackValue}
            </div>
          ) : null }
          {this.state.errorMessage ? (
            <div className="selectComp-error-text">
              {this.state.errorMessage}
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

