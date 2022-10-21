import { DSysGroupType } from "../../shared/index";
import {
  effectStyles,
  paintStyles,
  textStyles,
} from "./getStyles";

export default function changeStylesFolder(
  folderName: string,
  newFolderName: string,
  type: DSysGroupType
) {
  let styles;
  switch (type) {
    case DSysGroupType.ColorSet:
      styles = paintStyles(folderName);
      break;
    case DSysGroupType.TypographySet:
      styles = textStyles(folderName);
      break;
    case DSysGroupType.EffectSet:
      styles = effectStyles(folderName);
      break;
  }
  if (!styles) return;

  styles.map(style => {
    const figmaStyle = figma.getStyleById(style.id);
    if (!figmaStyle) return;
    const nameSansFolder = style.name.substring(folderName.length);
    figmaStyle.name = `${newFolderName}${nameSansFolder}`;
  });
}