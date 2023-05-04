import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateStyle(
  comp: TypographyDetail,
  fontStyle: string,
  token: DSysTypographyToken,
  updateAll: boolean = false,
) {
  // UPDATE
  if (updateAll) {
    const tokenset = comp.props.tokenGroup?.tokensets[0];
    const tokens = cleanAndSortTokens(tokenset);
    return tokens.map(tokenInfo => {
      const focusedToken = tokenInfo[1] as DSysTypographyToken;
      updateToken(
        comp, fontStyle, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, fontStyle, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  fontStyle: string,
  token: DSysTypographyToken
) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      figmaFontObj: {
        ...token.$value.figmaFontObj,
        style: fontStyle,
      },
    }
  });
}