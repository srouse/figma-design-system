import ValidationWorker from './ValidationWorker';

export type ValidatorSuccess = {
  success: boolean,
  message?: string,
}

export type ValidatorIgnored = 'ignored';

export type Validation = () => ValidatorSuccess;

export enum ValidationLocation {
  onValidateChange = 'onValidateChange',
  onValidateBlur = 'onValidateBlur',
}

export default class Validator {

  validationWorkersLookup: {[key:string]:ValidationWorker} = {};

  register(
    identifier: string,
    validate: Validation,
    locations?: ValidationLocation[] | ValidationLocation
  ) : ValidationWorker {
    if (this.validationWorkersLookup[identifier]) {
      // console.error(`duplicate identifiers where registered: ${identifier}`);
      return this.validationWorkersLookup[identifier];
    }

    let finalLocations: ValidationLocation[] | undefined;
    if (locations) {
      finalLocations = Array.isArray(locations) ? locations : [locations];
    } 
    const newWorker : ValidationWorker = new ValidationWorker(
      identifier,
      this,
      validate,
      finalLocations
    );
    this.validationWorkersLookup[identifier] = newWorker;
    return newWorker;
  }

  unregister(
    worker: ValidationWorker,
  ) {
    delete this.validationWorkersLookup[worker.identifier];
  }

  unregisterWithIdentifier(
    identifier: string,
  ) {
    delete this.validationWorkersLookup[identifier];
  }

  validate(): ValidationWorker[] {
    const errors = Object.values(this.validationWorkersLookup).filter(
      (worker) => {
        const result = worker.validate();
        return result.success === false;
      }
    );
    return errors;
  }
}