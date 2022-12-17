import {
  DSysComponentToken,
  TokenGroup,
} from "../../../../shared/index";


export default function updateComponentName(
  tokenGroup: TokenGroup | undefined,
  name: string,
  setTokenGroup: (tokenGroup: TokenGroup) => void,
) {
  if (tokenGroup) {
    const tokenset = {...tokenGroup.tokensets[0]};
    tokenset.$extensions["dsys.name"] = name;
    if (tokenset.component) {
      const token = {...tokenset.component as DSysComponentToken};
      token.$extensions["dsys.name"] = name;
      tokenset.component = {
        ...token,
      }
      const newTokenGroup = {
        ...tokenGroup,
        tokensets: [tokenset],
      };
      newTokenGroup.name = name;
      setTokenGroup(newTokenGroup);
    }
  }
}
