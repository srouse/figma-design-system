import { DSysSvgToken, DSysToken, DTTokenType, loopDesignSystemTokens, PromiseSequence } from "../../../../../../../shared";
import {
  FileCreateResults,
  GitHubSettings
} from "../../../../../../../shared/types/types";
import { GithubSuccess } from "../../../../types";

import IconFile from "./IconFile";

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
    loopDesignSystemTokens(
      fileCreationResults.tokenResults.tokens,
      undefined,
      undefined,
      undefined,
      (token: DSysToken) => {
        if (token.$type === DTTokenType.svg) {
          const iconToken = token as DSysSvgToken;
          const iconName = iconToken.$extensions["dsys.name"];

          const iconFile = new IconFile();
          iconFile.path = `transformations/fdst-web/icons/${iconName}.svg`;
          iconFile.content = iconToken.$value.svg;
          iconFiles.push(iconFile);

          const iconJsFile = new IconFile();
          iconJsFile.path = `transformations/fdst-web/icons/${iconName}.js`;
          iconJsFile.content = `export default \`${iconToken.$value.svg}\`;`;
          iconFiles.push(iconJsFile);
        }
      },
    );

    // send update feedback and send all of them
    updateFeedback(`uploading icons: transformations/fdst-web/icons/...`);
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