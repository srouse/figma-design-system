import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateLineHeight(
  comp: TypographyDetail,
  lineHeight: number | undefined,
  lineHeightUnit: string,
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
        comp, lineHeight, lineHeightUnit, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, lineHeight, lineHeightUnit, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  lineHeight: number | undefined,
  lineHeightUnit: string,
  token: DSysTypographyToken
) {
  if (lineHeight === undefined) {
    comp.props.updateToken({
      ...token,
      $value: {
        ...token.$value,
        lineHeight: {
          unit: 'AUTO',
        },
      }
    });
  }else {
    comp.props.updateToken({
      ...token,
      $value: {
        ...token.$value,
        lineHeight: {
          unit: lineHeightUnit as 'PIXELS' | 'PERCENT',
          value: Math.max(0, lineHeight),
        }
      }
    }); 
  }
}