import { DSysToken, DTTokenType, hexToRgb, MessageRequest, TokenGroup, validColor } from "../../shared/index";
import bounceBack from "../utils/postMessagePromise";

export function updateStyle(
  message: any,
  tokenGroup: TokenGroup,
) {
  const token = message.token as DSysToken;
  if (!tokenGroup || !token) {
    return bounceBack(message, {
      success: false,
      message: 'did NOT get a token or token group',
    });
  }
  if (token.$type === DTTokenType.color) {
    const colorStyle = figma.getStyleById(
      token.$extensions['dsys.styleId']
    ) as PaintStyle;
    if (colorStyle && colorStyle.type === 'PAINT') {
      if (validColor(token.$value)) {
        const rgb = hexToRgb(token.$value.hex);
        if (rgb) {
          colorStyle.paints = [
            {
              type: "SOLID",
              color: {
                r: rgb[0]/255,
                g: rgb[1]/255,
                b: rgb[2]/255,
              },
              opacity: token.$value.alpha,
            }
          ];
          colorStyle.name = `${
            tokenGroup.name}/${
            token.$extensions['dsys.name']
          }`;
          return bounceBack(message, {
            success: true,
          });
        }
        return bounceBack(message, {
          success: false,
          message: 'color not valid',
        });
      }
      return bounceBack(message, {
        success: false,
        message: 'color not valid',
      });
    }
  }
  return bounceBack(message, {
    success: false,
    message: 'style not found ( or supported )'
  });
}