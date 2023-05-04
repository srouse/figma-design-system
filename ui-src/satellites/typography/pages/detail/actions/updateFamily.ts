import { cleanAndSortTokens, DSysTypographyToken } from "../../../../../../shared";
import TypographyDetail from "../TypographyDetail";

export default function updateFamily(
  comp: TypographyDetail,
  fontFamily: string,
  token: DSysTypographyToken,
  updateAll: boolean = false,
) {
  // UPDATE
  const styles = comp._updateStyles(fontFamily, true);
  let regular = styles.find(style => {
    return style.name === 'Regular' || style.name === 'Normal'
  });
  const finalStyle = regular ? regular.value : styles[0].value;
  if (updateAll) {
    const tokenset = comp.props.tokenGroup?.tokensets[0];
    const tokens = cleanAndSortTokens(tokenset);
    return tokens.map(tokenInfo => {
      const focusedToken = tokenInfo[1] as DSysTypographyToken;
      updateToken(
        comp, fontFamily, finalStyle, focusedToken,
      );
    });
  }else {
    updateToken(
      comp, fontFamily, finalStyle, token,
    );
  }
}

function updateToken(
  comp: TypographyDetail,
  fontFamily: string,
  finalStyle: string,
  token: DSysTypographyToken) {
  comp.props.updateToken({
    ...token,
    $value: {
      ...token.$value,
      figmaFontObj: {
        family: fontFamily,
        style: finalStyle,
      },
    }
  });
}