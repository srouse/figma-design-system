

export default function roundToDecimal(
  num:number,
  decimals: number = 2
) {
  const multiplier = Math.pow(10, decimals);
  return Math.round( ( num + Number.EPSILON ) * multiplier ) / multiplier;
}