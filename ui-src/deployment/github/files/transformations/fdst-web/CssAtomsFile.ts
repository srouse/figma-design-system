import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import cssAtomsTransformation from "./utils/cssAtomsTransformation";

class CssAtomsFile extends File {

  path: string = 'transformations/fdst-web/css-atoms.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssAtomsTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssAtomsFile();