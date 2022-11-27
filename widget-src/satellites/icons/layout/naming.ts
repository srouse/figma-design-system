import { TokenGroup } from "../../../../shared/index";
import cleanName from "../../../../shared/utils/cleanName";
import { findComponentSet } from "./componentSet";
import { findParentGroup } from "./grouping";

// ICON NAMES
export function normalizeIconComponentNames(
  thisWidget: WidgetNode,
  tokenGroup: TokenGroup,
) {
  const groupParent = findParentGroup(thisWidget);
  const compSet = findComponentSet(thisWidget);
  if (!compSet || !groupParent) return false;

  // align with token group...
  compSet.name = tokenGroup.name || 'component';

  // icon names
  const nameLookup: {[key:string]: true} = {};
  const icons: {name:string, icon:ComponentNode}[] = [];
  compSet.children.map((child, index) => {
    const props = nameToProps(child.name);
    let theName = props.name || `icon-${index}`;
    // there is a quirk in Figma with appending a stupid " 1" on the end of 
    // things. Lets take care of that
    // chance of this biting me in the ass....5%
    if (
      theName.lastIndexOf(' 1') === theName.length-2 ||
      theName.lastIndexOf(' 2') === theName.length-2
    ) {
      theName = theName.substring(0, theName.length-2);
    }
    theName = cleanName(theName);
    theName = addToLookupWithUniqueName(nameLookup, theName);
    
    icons.push({
      name: theName,
      icon: child as ComponentNode,
    })
    const nameStr = `name=${theName}`;
    const styleStr = `style=${props.style || `regular`}`;
    child.name = `${nameStr}, ${styleStr}`;
  });

  // sort by name...
  icons.sort((a, b) => a.name.localeCompare(b.name));
  icons.map((icon, index) => {
    compSet.insertChild(index, icon.icon);
  });
}

export function addToLookupWithUniqueName(
  lookup: {[key:string]: true},
  name: string,
) {
  let newName = name;
  while (lookup[newName] === true) {
    newName = `${name}-${Math.round(Math.random()*10000)}`;
  }
  lookup[newName] = true;
  return newName;
}

export function nameToProps(name: string) {
  const childNameArr = name.split(',');
  const props: {[key:string]: string} = {};
  childNameArr.map(chunk => {
    const chunkArr = chunk.split('=');
    if (chunkArr.length === 2) {
      const name = `${chunkArr[0]}`.trim();
      const value = `${chunkArr[1]}`.trim();
      props[name] = value;
    }
  });
  return props;
}