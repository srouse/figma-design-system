

export enum ColorStepTypes {
  none = 'none',
  step9ThreeDigit = 'step-9-three-digit',
  step9TwoDigit = 'step-9-two-digit',
  step9OneDigit = 'step-9-one-digit',
  colorGroup = "color-group",
  stepLightestToDarkest ='lightest-to-darkest',
}

export type StepsInformation = {
  steps: string,
  type: ColorStepTypes,
}

export function getColorGroupInfo() : StepsInformation {
  return {
    steps: '',
    type: ColorStepTypes.colorGroup,
  }
}

export function getLightestStepsInfo() : StepsInformation {
  return {
    steps: 'lightest, lighter, light, [base], dark, darker, darkest',
    type: ColorStepTypes.stepLightestToDarkest,
  }
}

export function getStep9OneDigitInfo() : StepsInformation {
  return {
    steps: '1, 2, 3, 4, [base:5], 6, 7, 8, 9',
    type: ColorStepTypes.step9OneDigit,
  }
}

export function getStep9TwoDigitInfo() : StepsInformation {
  return {
    steps: '10, 20, 30, 40, [base:50], 60, 70, 80, 90',
    type: ColorStepTypes.step9TwoDigit,
  }
}

export function getStep9ThreeDigitInfo() : StepsInformation {
  return {
    steps: '100, 200, 300, 400, [base:500], 600, 700, 800, 900',
    type: ColorStepTypes.step9ThreeDigit,
  }
}
