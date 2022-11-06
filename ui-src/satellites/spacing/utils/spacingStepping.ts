


export enum SpacingStepTypes {
  none = 'none',
  smallestToLargest = 'smallestToLargest',
  tshirtSizes = 'tshirtSizes',
  sequenceSizes = 'sequenceSizes',
  sequenceWithFractionsSizes = 'sequenceWithFractionsSizes',
  spacingGroup = "spacingGroup",
}

export const spacingSteps = [
  {
    name: 'Choose a Step Pattern',
    value: SpacingStepTypes.none,
  },
  {
    name: 'small[er, est], large[r,st]',
    value: SpacingStepTypes.smallestToLargest
  },
  {
    name: 'xxxl, xxl, xl, l, m, s, xs, xxs, xxxs',
    value: SpacingStepTypes.tshirtSizes
  },
  {
    name: '0, 1, 2, 3, 4, ...8',
    value: SpacingStepTypes.sequenceSizes
  },
  {
    name: '0, 1[-3,-6,-9], 2[-3,-6,-9], 3, 4, ...8',
    value: SpacingStepTypes.sequenceWithFractionsSizes
  },
  {
    name: 'Custom Group',
    value: SpacingStepTypes.spacingGroup
  },
];