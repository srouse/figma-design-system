import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import cssVariablesTypingsTransformation from "./utils/cssVariablesTypingsTransformation";

class CssVarsTypingsFile extends File {

  path: string = 'transformations/fdst-web/css-vars.d.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssVariablesTypingsTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssVarsTypingsFile();