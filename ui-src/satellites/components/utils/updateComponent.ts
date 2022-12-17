import { DSysComponentToken, SelectDropDown, TokenGroup } from "../../../../shared";


export default function updateComponent(
  tokenGroup: TokenGroup | undefined,
  valueObj: SelectDropDown | undefined,
  updateTokenGroup: (tokenGroup: TokenGroup) => void,
) {
  if (tokenGroup && valueObj) {
    const comp = valueObj;
    const tokenset = {...tokenGroup.tokensets[0]};
    tokenset.$extensions["dsys.name"] = comp.name;
    if (tokenset.component) {
      const token = {...tokenset.component as DSysComponentToken};
      token.$extensions["dsys.name"] = comp.name;
      token.$value = comp.value;
      tokenset.component = {
        ...token,
      }
      const newTokenGroup = {
        ...tokenGroup,
        tokensets: [tokenset],
      };
      newTokenGroup.name = comp.name;
      updateTokenGroup(newTokenGroup);
    }
  }
}
