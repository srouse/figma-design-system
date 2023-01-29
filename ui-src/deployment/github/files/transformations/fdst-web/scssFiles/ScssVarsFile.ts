import { GitHubSettings } from "../../../../../../../shared/types/types";
import File from "../../../File";
import variablesTransformation from "../utils/variablesTransformation";

class ScssVarsFile extends File {

  path: string = 'transformations/fdst-web/scss/scss-vars.scss';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await variablesTransformation(
        this.fileCreationResults, true
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new ScssVarsFile();