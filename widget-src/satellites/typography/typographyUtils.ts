import { DSysGroupType, DSysLevel, DSysTokenset, DTTokenType, TokenGroup } from "../../../shared/index";
import { FigmaTextStyle } from "../../../shared/types/types";
import { textStyles } from "../../actions/getStyles";


export function pullTokensFromTextStyles(
  tokenGroup: TokenGroup,
  setTokenGroup: (val:TokenGroup) => void,
  nodeId: string,
) {
  const styles = textStyles(tokenGroup.name);
  const stylesTokenGroup = textStylesToDSysTokenset(
    styles, tokenGroup.name, nodeId
  );
  console.log(stylesTokenGroup);
  /*
  if (!stylesTokenGroup) return;
  console.log('stylesTokenGroup',stylesTokenGroup);
  setTokenGroup({
    ...tokenGroup,
    tokensets: [stylesTokenGroup],
  });*/
}


export function textStylesToDSysTokenset(
  styles: FigmaTextStyle[],
  name: string | undefined,
  nodeId: string,
) : DSysTokenset | false {
  if (!name) return false;

  const folderName = name;
  const folderStyles = styles.filter(style => {
    return style.name.indexOf(`${folderName}/`) === 0;
  })

  const tokenset: DSysTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.TypographySet,
      'dsys.name': name,
      "dsys.nodeId": nodeId,
    },
    $description: `${name} typography tokens`,
  };

  folderStyles.map((style, index) => {
    // sans folder
    let name = style.name.substring(folderName.length+1);
    if (!name) name = '';
    console.log(style);
    /*tokenset[name] = {
        $extensions: {
          'dsys.level'    : DSysLevel.token,
          'dsys.name'     : name,
          'dsys.index'    : index,
          'dsys.styleId'  : style.id,
        },
        $value: {
        },
        $type: DTTokenType.typography
      };
    };*/
  });

  return tokenset;
}