import { findBaseWidget } from "../utils"


export default async function nodeToImage() {
  const base = findBaseWidget();
  if (!base) return;

  // Export a 2x resolution PNG of the node
  const bytes = await base.exportAsync({
    format: 'PNG',
    constraint: { type: 'SCALE', value: 1 },
  })

  // Add the image onto the canvas as an image fill in a frame
  const image = figma.createImage(bytes);
  const frame = figma.createFrame();
  frame.x = 200;
  frame.resize(base.width/2, base.height/2);
  frame.fills = [{
    imageHash: image.hash,
    scaleMode: "FILL",
    scalingFactor: 1,
    type: "IMAGE",
  }]

  return image;
}