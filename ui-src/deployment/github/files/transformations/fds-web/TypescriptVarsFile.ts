import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import javascriptVarsTransformation from "./utils/javascriptVarsTransformation";

class TypescriptVarsFile extends File {

  path: string = 'transformations/fds-web/javascript-vars.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await javascriptVarsTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new TypescriptVarsFile();