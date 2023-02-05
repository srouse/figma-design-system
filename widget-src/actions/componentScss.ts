

export default function componentScss(
  compId: string,
) {
  const comp = figma.getNodeById(compId);
  if (comp) {
    console.log('comp', comp);
    return `lets go ${comp.id}`;
  }
  return false;
}