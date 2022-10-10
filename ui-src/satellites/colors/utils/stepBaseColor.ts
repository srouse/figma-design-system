import {
  rgbToHex,
  hexToRgb
 } from '../../../../shared';

export type StepBaseResults = {
  success: boolean,
  message: string,
  steps?: StepResult[],
}

type StepResult = {
  r: number,
  g: number,
  b: number,
  hex: string,
  step: string,
};

export default function stepBaseColor(
  baseColor: string | undefined,
  steps: string[],
  includeBlackAndWhite: boolean = true
) : StepBaseResults {

  let totalTintSteps = includeBlackAndWhite ? 0 : 1;
  let totalShadeSteps = includeBlackAndWhite ? 0 : 1;
  let baseIndex = -1;
  let workingOnTints = true;
  let success = true;
  let message = '';
  steps.map((step, index) => {
    if (isBaseName(step)) {
      workingOnTints = false;
      baseIndex = index;
    }else{
      if (workingOnTints) {
        totalTintSteps++;
      }else{
        totalShadeSteps++;
      }
    }
  });
  if (!success) {
    return {
      success,
      message,
    }
  }

  if (!baseColor) {
    console.error('[stepBaseColor] baseColor is null');
    return {
      success: false,
      message: 'baseColor is null',
    }
  }

  const baseRgb = hexToRgb( baseColor );
  if (baseRgb && baseRgb.length === 3) {
    const whiteColor: StepResult = {
      r:255, g:255, b:255,
      hex: '#ffffff', step: 'todo'
    };
    const blackColor: StepResult = {
      r:0, g:0, b:0,
      hex: '#000000', step: 'todo'
    };
  
    const rDarkStep = baseRgb[0] / totalShadeSteps;
    const gDarkStep = baseRgb[1] / totalShadeSteps;
    const bDarkStep = baseRgb[2] / totalShadeSteps;

    const rLightStep = (255 - baseRgb[0]) / totalTintSteps;
    const gLightStep = (255 - baseRgb[1]) / totalTintSteps;
    const bLightStep = (255 - baseRgb[2]) / totalTintSteps;

    let finalSteps: StepResult[] = [];

    // Light Steps
    let lightStepCount = 1;
    while( lightStepCount < totalTintSteps ) {
      const r = cleanColorNumber( baseRgb[0] + (lightStepCount * rLightStep) );
      const g = cleanColorNumber( baseRgb[1] + (lightStepCount * gLightStep) );
      const b = cleanColorNumber( baseRgb[2] + (lightStepCount * bLightStep) );
      finalSteps.unshift({
        r, g, b,
        hex: rgbToHex(r, g, b),
        step: 'todo',
    });
      lightStepCount++;
    }
    if (includeBlackAndWhite)
      finalSteps.unshift(whiteColor);

    
    finalSteps.push({
      r: baseRgb[0],
      g: baseRgb[1],
      b: baseRgb[2],
      hex: rgbToHex(baseRgb[0], baseRgb[1], baseRgb[2]),// ensures 6 characters
      step: 'todo',
    });

    // Dark Steps
    let darkStepCount = 1;
    while( darkStepCount < totalShadeSteps ) {
      const r = cleanColorNumber( baseRgb[0] - (darkStepCount * rDarkStep) );
      const g = cleanColorNumber( baseRgb[1] - (darkStepCount * gDarkStep) );
      const b = cleanColorNumber( baseRgb[2] - (darkStepCount * bDarkStep) );
      finalSteps.push({
        r, g, b,
        hex: rgbToHex(r, g, b),
        step: 'todo',
    });
      darkStepCount++;
    }
    if (includeBlackAndWhite)
      finalSteps.push(blackColor);

    // weave step back in...
    finalSteps.map((step, index) => {
      step.step = findStepName(steps[index]);
    });

    return {
      success: true,
      message: '',
      steps: finalSteps,
    }
  }
  return {
    success: false,
    message: 'base color was not valid',
  }
}

function cleanColorNumber (num: number) : number {
  return Math.max( 0, Math.min( 255, Math.round(num) ));
}

function findStepName(stepName: string | undefined) {
  if (!stepName) return '';
  let finalStepName = stepName.trim();
  if (isBaseName(finalStepName)) {
    finalStepName = finalStepName.replace(']', '').replace('[', '');
    const stepNameArr = finalStepName.split(':');
    if (stepNameArr.length === 1) {
      return '';// no step name
    }else{
      return stepNameArr[1].toLowerCase();
    }
  }else{
    return finalStepName.toLowerCase();
  }
}

function isBaseName(stepName: string | undefined) {
  if (!stepName) return false;
  return stepName.trim().indexOf('[base') === 0;
}