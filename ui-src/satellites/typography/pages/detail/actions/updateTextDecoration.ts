import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateTextDecoration(
  comp: TypographyDetail,
  textDecoration: string,
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
        comp, textDecoration, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, textDecoration, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  textDecoration: string,
  token: DSysTypographyToken
) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      textDecoration: textDecoration as 'NONE' | 'UNDERLINE' | 'STRIKETHROUGH'
    }
  });
}