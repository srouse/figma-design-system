import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import cssVariablesTransformation from "./utils/cssVariablesTransformation";

class CssVars extends File {

  path: string = 'transformations/fdst-web/css-vars.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssVariablesTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssVars();