

export default function hexToRgb (hex: string) {
  const result = hex.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1).match(/.{2}/g);
  if (result) {
    return result.map(x => parseInt(x, 16));
  }
  return null;
}