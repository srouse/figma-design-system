

export enum ColorStepTypes {
  step10Step = "step-10-step",
  step10StepColor = "step-10-step-color",
  stepLightestToDarkest ='lightest-to-darkest',
  stepCustom = "step-custom",
  stepSingleColor = 'step-single-color',
}

export type StepsInformation = {
  steps: string,
  includeBlackAndWhite: boolean,
  type: ColorStepTypes,
}

export function getCustomStepsInfo() : StepsInformation {
  return {
    steps: '01, 02, [base:03], 04, 05',
    includeBlackAndWhite: false,
    type: ColorStepTypes.stepCustom,
  }
}

export function getLightestStepsInfo() : StepsInformation {
  return {
    steps: 'lightest, lighter, light, [base], dark, dark, darkest',
    includeBlackAndWhite: false,
    type: ColorStepTypes.stepLightestToDarkest,
  }
}

export function get10StepsInfo() : StepsInformation {
  return {
    steps: '00, 01, 02, 03, 04, [base:05], 06, 07, 08, 09, 10',
    includeBlackAndWhite: true,
    type: ColorStepTypes.step10Step,
  }
}

export function get10ColorStepsInfo() : StepsInformation {
  return {
    steps: '01, 02, 03, 04, [base:05], 06, 07, 08, 09',
    includeBlackAndWhite: false,
    type: ColorStepTypes.step10StepColor,
  }
}

export function getSingleColorInfo() : StepsInformation {
  return {
    steps: '[base]',
    includeBlackAndWhite: false,
    type: ColorStepTypes.stepSingleColor,
  }
}
