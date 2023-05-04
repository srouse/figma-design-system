import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import variablesTransformation from "./utils/variablesTransformation";

class CssVarsFile extends File {

  path: string = 'transformations/fds-web/css-vars.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await variablesTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssVarsFile();