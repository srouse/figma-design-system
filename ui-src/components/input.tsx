import React, {
  FocusEvent,
  KeyboardEvent,
} from "react";
import {
  ValidationWorker
} from "../../shared/index";
import {
  ValidationLocation,
  ValidatorSuccess
} from "../../shared/validator/Validator";
import "./Input.css";

interface InputProps {
  label: string,
  value: string | undefined,
  feedbackValue?: string | undefined,
  onFocus?: () => void,
  onChange?: (value: string) => void,
  onEnter?: (value: string) => void,
  onBlur?: (value: string) => void,
  increments?: {unshifted:number,shifted:number},
  onArrowDown?: (
    value: string,
    increment: number,
    evt: KeyboardEvent<HTMLInputElement>
  ) => void,
  onArrowUp?: (
    value: string,
    increment: number,
    evt: KeyboardEvent<HTMLInputElement>
  ) => void,
  onArrowUpOrDown?: (
    value: string,
    increment: number,
    evt?: KeyboardEvent<HTMLInputElement>
  ) => void,
  onEnterOrBlur?: (value: string) => void,
  background?: 'light' | 'dark',
  className?: string,
  type? : 'text' | 'number' | 'password',
  readOnly? : boolean,
  hideLabel? : boolean,
  hideBorder? : boolean,
  helpText? : string,
  placeholder? : string,
  textAlign? : 'left' | 'right' | 'center',
  validation?: ValidationWorker,
  selectAllOnFocus?: boolean,
}

export default class Input extends React.Component<InputProps> {

  constructor(props: InputProps | Readonly<InputProps>) {
    super(props);
    this.state = {
      valid: true,
      value: this.props.value,
      errorMessage: undefined,
    };
    this.addValidationSideEffects();
  }

  componentWillUnmount() {
    if (this.props.validation) {
      this.props.validation.unregister();
    }
  }

  componentDidUpdate(
    prevProps: Readonly<InputProps>,
  ): void {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
      })
    }
    this.addValidationSideEffects();
  }

  addValidationSideEffects() {
    if (this.props.validation && !this.props.validation.sideEffects) {
      this.props.validation.sideEffects = (validationResults : ValidatorSuccess) => {
        this.setState({
          valid: validationResults.success,
          errorMessage: validationResults.success ? 
            '' : validationResults.message
        });
      }
    }
  }

  state : {
    valid: boolean,
    value: string | undefined,
    errorMessage: string | undefined,
  }

  render() {
    return (
      <div className={`
        ${this.props.className || ''}
        ${this.props.background || ''}
        ${this.props.hideBorder ? 'hide-border' : ''}
        ${this.state.valid ? 'valid' : 'invalid'}
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
                placeholder={this.props.placeholder}
                value={this.state.value}
                type={this.props.type || 'text'}
                style={{textAlign: this.props.textAlign || 'left'}}
                onFocus={(evt: FocusEvent) => {
                  if (this.props.onFocus) this.props.onFocus();
                  this.setState({valid: true});
                  if (this.props.selectAllOnFocus === true) {
                    const input = (evt.target as HTMLInputElement);
                    const prevType = input.type;
                    input.type = 'text';// number doesn't do this...
                    input.setSelectionRange(
                      0, input.value.length
                    );
                    input.type = prevType;
                  }
                }}
                onBlur={(evt: FocusEvent<HTMLInputElement>) => {
                  if (this.props.validation) {
                    this.props.validation.validateOnLocation(
                      ValidationLocation.onValidateBlur
                    );
                  }
                  const targetValue = (evt.target as HTMLInputElement).value;
                  if (this.props.onBlur)
                    this.props.onBlur(targetValue);
                  if (this.props.onEnterOrBlur)
                    this.props.onEnterOrBlur(targetValue);
                }}
                onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => {
                  const targetValue = (evt.target as HTMLInputElement).value;
                  if (evt.code === 'Enter') {
                    if (this.props.onEnter) {
                      evt.preventDefault();
                      this.props.onEnter(targetValue);
                    }
                    if (this.props.onEnterOrBlur)
                      this.props.onEnterOrBlur(targetValue);
                  }

                  let increments = this.props.increments;
                  if (!increments) {
                    increments = {
                      shifted: 10,
                      unshifted: 1,
                    }
                  }

                  if (evt.code === 'ArrowDown') {
                    if (this.props.onArrowDown) {
                      evt.preventDefault();
                      this.props.onArrowDown(
                        targetValue,
                        evt.shiftKey ? 
                          -increments.shifted : 
                          -increments.unshifted,
                        evt
                      );
                    }
                    if (this.props.onArrowUpOrDown) {
                      evt.preventDefault();
                      this.props.onArrowUpOrDown(
                        targetValue,
                        evt.shiftKey ? 
                          -increments.shifted : 
                          -increments.unshifted,
                        evt
                      );
                    } 
                  }
                  if (evt.code === 'ArrowUp') {
                    if (this.props.onArrowUp) {
                      evt.preventDefault();
                      this.props.onArrowUp(
                        targetValue,
                        evt.shiftKey ? 
                          increments.shifted : 
                          increments.unshifted,
                        evt
                      );
                    }
                    if (this.props.onArrowUpOrDown) {
                      evt.preventDefault();
                      this.props.onArrowUpOrDown(
                        targetValue,
                        evt.shiftKey ? 
                          increments.shifted : 
                          increments.unshifted,
                        evt
                      );
                    } 
                  }
                  return;
                }}
                onChange={(evt: any) => {
                  this.setState({
                    value: evt.target.value,
                    errorMessage: undefined,
                    valid: true// just to reset during typing
                  });
                  if (this.props.onChange)
                    this.props.onChange(evt.target.value);

                  setTimeout(() => {
                    if (this.props.validation) {
                      this.props.validation.validateOnLocation(
                        ValidationLocation.onValidateChange
                      );
                    }
                  }, 0);
                }}>
              </input>
            )
          }
          {this.props.feedbackValue ? (
            <div className="inputComp-feedback-value">
              {this.props.feedbackValue}
            </div>
          ) : null }
          {(this.props.helpText && !this.state.errorMessage) ? (
            <div className="inputComp-help-text">
              {this.props.helpText}
            </div>
          ) : null }
          {this.state.errorMessage ? (
            <div className="inputComp-error-text">
              {this.state.errorMessage}
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

