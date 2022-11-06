import Validator, {
  ValidationLocation, ValidatorSuccess
} from './Validator';

export default class ValidationWorker {

  identifier: string;
  validator: Validator;
  locations: ValidationLocation[] = [];
  sideEffects?: (validation : ValidatorSuccess) => void;
  _validate: () => ValidatorSuccess;

  constructor(
    identifier: string,
    validator: Validator,
    validate: () => ValidatorSuccess,
    locations: ValidationLocation[] = [ValidationLocation.onValidateBlur]
  ) {
    this.identifier = identifier;
    this.validator = validator;
    this._validate = validate;
    this.locations = locations;
  }

  validate() {
    const result = this._validate();
    if (this.sideEffects) this.sideEffects(result);
    return result;
  }

  validateOnLocation(targetLocation: ValidationLocation) {
    if (this.locations.includes(targetLocation)) {
      return this.validate();
    };
    return null;
  }

  unregister() {
    this.validator.unregister(this);
  }
}