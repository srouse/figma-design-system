import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import cssVariablesTransformation from "../actions/transformations/cssVariablesTransformation";
import { DSys } from "../../../../shared";

class CssVarsTransformationFile extends File {

  path: string = 'cssVars.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssVariablesTransformation(
        this.fileCreationResults.tokenResults.tokens as DSys
      );
      return transformationResults.content;
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssVarsTransformationFile();