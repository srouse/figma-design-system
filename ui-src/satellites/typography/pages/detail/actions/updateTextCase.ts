import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateTextCase(
  comp: TypographyDetail,
  textCase: string,
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
        comp, textCase, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, textCase, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  textCase: string,
  token: DSysTypographyToken
) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      textCase: textCase as 'ORGINAL' | 'UPPER' | 'LOWER' | 'TITLE'
    }
  });
}