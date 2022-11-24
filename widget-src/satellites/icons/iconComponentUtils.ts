import {
  DSysGroupType,
  DSysIconTokenset,
  DSysLevel,
  DSysTokenset,
  DTTokenType,
  TokenGroup
} from "../../../shared/index";
import { DSysSvgToken } from "../../../shared/types/designSystemTypes";
import { findWidget } from "../../utils";
import { findComponentSet } from "./layout/componentSet";
import { nameToProps } from "./layout/naming";

export async function pullTokensFromIconComponentSet(
  tokenGroup: TokenGroup,
  setTokenGroup: (val:TokenGroup) => void,
  nodeId: string,
) {
  const widget = findWidget(nodeId);
  const compSet = findComponentSet(widget);
  const stylesTokenGroup = await compSetToDSysTokenset(
    compSet,
    tokenGroup.name,
    nodeId
  );
  if (!stylesTokenGroup) return;
  setTokenGroup({
    ...tokenGroup,
    tokensets: [stylesTokenGroup],
  });
}

export async function compSetToDSysTokenset(
  compSet: ComponentSetNode | undefined,
  name: string | undefined,
  nodeId: string,
) : Promise<DSysTokenset | false> {
  if (!name || !compSet) return false;
  
  const tokenset: DSysIconTokenset = {
    $extensions: {
      'dsys.level': DSysLevel.tokenset,
      'dsys.type': DSysGroupType.IconSet,
      'dsys.name': name,
      'dsys.nodeId': nodeId,
    },
    $description: `${name} icon tokens`,
  };

  const promiseAllArr: Promise<void>[] = [];
  const errorLog: string[] = [];
  compSet.children.map((child) => {
    const comp = child as ComponentNode;
    const props = nameToProps(child.name);
    if (!props.name) return;
    const tokenInfo: DSysSvgToken = {
      $extensions: {
        'dsys.level'            : DSysLevel.token,
        'dsys.name'             : props.name,
        'dsys.componentSetId'   : comp.id,
      },
      $value: {
        svg: '',
        style: props.style || 'regular',
        sizes: [12, 24, 32],
      },
      $type: DTTokenType.svg
    };
    promiseAllArr.push(
      (async () => {
        const svg = await getSvg(comp, errorLog);
        tokenInfo.$value.svg = svg || '';
      })()
    )
    tokenset[props.name] = tokenInfo;
  });
  await Promise.all(promiseAllArr);
  console.log('totes failed', errorLog.length);
  return tokenset;
}

export async function getSvg(
  comp: ComponentNode | VectorNode | SceneNode,
  errorLog: string[],
) {
  if (!comp) return;
  const bytes = await comp.exportAsync({ format: 'SVG' })
    .catch(err => {
      errorLog.push(comp.name);
      console.log(err, comp.name );
    });
  const str = Utf8ArrayToStr(bytes);
  return str;
}

function Utf8ArrayToStr(array: Uint8Array | undefined | void) {
  if (!array) return;

  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
      c = array[i++];
      switch(c >> 4)
      {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
          case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
          case 14:
              // 1110 xxxx  10xx xxxx  10xx xxxx
              char2 = array[i++];
              char3 = array[i++];
              out += String.fromCharCode(((c & 0x0F) << 12) |
                  ((char2 & 0x3F) << 6) |
                  ((char3 & 0x3F) << 0));
              break;
      }
  }

  return out;
}