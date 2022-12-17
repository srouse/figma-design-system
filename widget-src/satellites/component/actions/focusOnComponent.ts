import {
  DSysComponentToken,
  TokenGroup,
} from "../../../../shared/index";

export default function focusOnComponent(
  tokenGroup: TokenGroup,
) {
  if (tokenGroup && tokenGroup.tokensets.length > 0) {
    const tokenset = tokenGroup.tokensets[0];
    const componentInfo = tokenset.component as DSysComponentToken;
    let node = figma.getNodeById(componentInfo.$value);
    
    if (node) {
      let page = node.parent;
      while (page && (page.type !== 'PAGE')) {
        page = page.parent;
      }
      if (page) figma.currentPage = page;
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  }
}