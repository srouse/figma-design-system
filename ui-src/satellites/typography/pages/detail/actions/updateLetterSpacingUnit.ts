import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateLetterSpacingUnit(
  comp: TypographyDetail,
  letterSpacingUnit: string,
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
        comp, letterSpacingUnit, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, letterSpacingUnit, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  letterSpacingUnit: string,
  token: DSysTypographyToken
) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      letterSpacing: {
        ...token.$value.letterSpacing,
        unit: letterSpacingUnit as 'PIXELS' | 'PERCENT',
      },
    }
  });
}