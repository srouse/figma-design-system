import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateLetterSpacing(
  comp: TypographyDetail,
  letterSpacing: number,
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
        comp, letterSpacing, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, letterSpacing, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  letterSpacing: number,
  token: DSysTypographyToken
) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      letterSpacing: {
        ...token.$value.letterSpacing,
        value: letterSpacing,
      }
    }
  });
}