import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import cssFontsTransformation from "./utils/cssFontsTransformation";

class CssFontsFile extends File {

  path: string = 'transformations/fds-web/css-fonts.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssFontsTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssFontsFile();