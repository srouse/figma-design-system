import React, { FocusEvent, KeyboardEvent, KeyboardEventHandler, MouseEvent } from "react";
import Validator, {
  getId,
  ValidationLocations,
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
  onArrowDown?: (value: string, evt: KeyboardEvent<HTMLInputElement>) => void,
  onArrowUp?: (value: string, evt: KeyboardEvent<HTMLInputElement>) => void,
  onArrowUpOrDown?: (
    value: string,
    direction: 'up' | 'down',
    evt: KeyboardEvent<HTMLInputElement>
  ) => void,
  onEnterOrBlur?: (value: string) => void,
  background?: 'light' | 'dark',
  className?: string,
  password? : boolean,
  readOnly? : boolean,
  hideLabel? : boolean,
  hideBorder? : boolean,
  helpText? : string,
  textAlign? : 'left' | 'right' | 'center',
  validator?: Validator,
  onValidate? : () => ValidatorSuccess,
  onValidateBlur? : () => ValidatorSuccess,
}

export default class Input extends React.Component<InputProps> {

  constructor(props: InputProps | Readonly<InputProps>) {
    super(props);
    this.uid = getId();
    this.state = {
      valid: true,
      value: this.props.value,
    };

    this.props.validator?.registerComponent(
      this.uid,
      ValidationLocations.onValidate,
      () => {
        if (!this.props.onValidate) return {success:true};
        const results = this.props.onValidate();
        this.setState({valid: results.success});
        return results;
      }
    );
    this.props.validator?.registerComponent(
      this.uid,
      ValidationLocations.onValidateBlur,
      () => {
        if (!this.props.onValidateBlur) return {success:true};
        const results = this.props.onValidateBlur();
        this.setState({valid: results.success});
        return results;
      }
    );
  }

  componentWillUnmount() {
    this.props.validator?.unregister(
      this.uid, ValidationLocations.onValidate
    );
    this.props.validator?.unregister(
      this.uid, ValidationLocations.onValidateBlur
    );
  }

  componentDidUpdate(
    prevProps: Readonly<InputProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value,
      })
    }
  }

  uid: string;
  state : {
    valid: boolean,
    value: string | undefined
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
                type={this.props.password ? 'password' : 'text'}
                style={{textAlign: this.props.textAlign || 'left'}}
                onFocus={() => {
                  if (this.props.onFocus) this.props.onFocus();
                  this.setState({valid: true});
                }}
                onBlur={(evt: FocusEvent<HTMLInputElement>) => {
                  this.props.validator?.validate(
                    this.uid, ValidationLocations.onValidateBlur
                  );
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
                  if (evt.code === 'ArrowDown') {
                    if (this.props.onArrowDown) {
                      evt.preventDefault();
                      this.props.onArrowDown(
                        targetValue,
                        evt
                      );
                    }
                    if (this.props.onArrowUpOrDown) {
                      evt.preventDefault();
                      this.props.onArrowUpOrDown(
                        targetValue,
                        'down',
                        evt
                      );
                    } 
                  }
                  if (evt.code === 'ArrowUp') {
                    if (this.props.onArrowUp) {
                      evt.preventDefault();
                      this.props.onArrowUp(
                        targetValue,
                        evt
                      );
                    }
                    if (this.props.onArrowUpOrDown) {
                      evt.preventDefault();
                      this.props.onArrowUpOrDown(
                        targetValue,
                        'up',
                        evt
                      );
                    } 
                  }
                  return;
                }}
                onChange={(evt: any) => {
                  this.setState({
                    value: evt.target.value
                  })
                  if (this.props.onChange)
                    this.props.onChange(evt.target.value);

                  setTimeout(() => {
                    this.props.validator?.validate(
                      this.uid, ValidationLocations.onValidate
                    );
                  }, 0);
                }}
                value={this.state.value}
                value-off={this.props.value}>
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

