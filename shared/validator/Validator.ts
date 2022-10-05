
export type ValidatorSuccess = {
  success: boolean,
  message?: string,
}

export type Validation = () => ValidatorSuccess;

export type ValidatorRegistration = {
  validator: Validator,
  validation: Validation
};

export enum ValidationLocations {
  onValidate = 'onValidate',
  onValidateChange = 'onValidateChange',
  onValidateBlur = 'onValidateBlur',
}


let validationId = 0;

export function getId() {
  return `${validationId++}`;
}

export default class Validator {

  constructor() {
    this.registrations = {};
  }

  registrations : {[key:string]:Validation};

  register(
    validation: Validation
  ) : ValidatorRegistration {
    return {
      validator: this,
      validation
    };
  }

  registerComponent(
    id:string,
    location: ValidationLocations,
    funk: Validation
  ) {
    this.registrations[`${id}-${location}`] = funk;
  }

  unregister(
    id: string,
    location: ValidationLocations,
  ) {
    delete this.registrations[`${id}-${location}`];
  }

  validate(
    id: string,
    location: ValidationLocations,
  ) {
    if (id) {
      if (this.registrations[`${id}-${location}`]) {
        this.registrations[`${id}-${location}`]();
      }
    }
  }

  validateAll() : ValidatorSuccess[] {
    console.log(this.registrations)
    const final = Object.values(this.registrations).map(funk => funk());
    const errors = final.filter(result => result.success === false);
    return errors;
  }

}