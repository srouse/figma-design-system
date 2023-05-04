import { DSysSheet, DSysSvgToken, DSysToken, DTTokenType, loopDesignSystemTokens, PromiseSequence } from "../../../../../../../shared";
import {
  FileCreateResults,
  GitHubSettings
} from "../../../../../../../shared/types/types";
import { GithubSuccess } from "../../../../types";

import IconFile from "./IconFile";
import iconWebComp from "./IconWebComp";

class IconsFiles {

  async upload(
    gitHubSettings: GitHubSettings,
    updateFeedback: (update: string, doUpdatePercentDone?: boolean) => void,
    fileCreationResults?: FileCreateResults,
  ) : Promise<GithubSuccess> {
    if (
      !fileCreationResults ||
      !fileCreationResults.tokenResults
    ) return {
      success: false,
      message: 'no tokens found.',
    };
  
    // find all the icons and create iconFiles from them
    const iconFiles: IconFile[] = [];
    let prefix = '';
    loopDesignSystemTokens(
      fileCreationResults.tokenResults.tokens,
      (tokenSheet: DSysSheet) => {
        prefix = tokenSheet.$extensions["dsys.prefix"];
      },
      undefined,
      undefined,
      (token: DSysToken) => {
        if (token.$type === DTTokenType.svg) {
          const iconToken = token as DSysSvgToken;
          const iconName = iconToken.$extensions["dsys.name"];

          const iconFile = new IconFile();
          iconFile.path = `transformations/fds-web/icons/${iconName}.svg`;
          iconFile.content = iconToken.$value.svg;
          iconFiles.push(iconFile);

          const iconJsFile = new IconFile();
          iconJsFile.path = `transformations/fds-web/icons/${iconName}.js`;
          iconJsFile.content = `export default \`${iconToken.$value.svg}\`;`;
          iconFiles.push(iconJsFile);

          const iconWebCompFile = new IconFile();
          iconWebCompFile.path = `transformations/fds-web/icons/${iconName}-web-comp.js`;
          iconWebCompFile.content = iconWebComp(iconToken.$value.svg, iconName, prefix);
          iconFiles.push(iconWebCompFile);
        }
      },
    );

    // send update feedback and send all of them
    updateFeedback(`uploading icons: transformations/fds-web/icons/...`);
    const results = await PromiseSequence(
      iconFiles.map(iconFile => {
        return async () => {
          updateFeedback(`uploading icon: ${iconFile.path}`, false);
          return iconFile.upload(
            gitHubSettings
          );
        }
      })
    ) as GithubSuccess[];

    // send back an error result if there is one (only need a single one)
    const failure = results.find(result => result.success === false);
    if (failure) {
      return failure;
    }
    return {
      success: true,
      message: 'uploaded icon files.',
    }; 
  }
}

export default new IconsFiles();