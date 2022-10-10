import React from "react";
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

  uid: string;
  state : {
    valid: boolean,
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
                onBlur={() => {
                  this.props.validator?.validate(
                    this.uid, ValidationLocations.onValidateBlur
                  );
                }}
                onChange={(evt: any) => {
                  if (this.props.onChange)
                    this.props.onChange(evt.target.value);

                  setTimeout(() => {
                    this.props.validator?.validate(
                      this.uid, ValidationLocations.onValidate
                    );
                  }, 0);
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

