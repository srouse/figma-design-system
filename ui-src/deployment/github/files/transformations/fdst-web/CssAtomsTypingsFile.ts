import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";
import cssAtomsTypingsTransformation from "./utils/cssAtomsTypingsTransformation";

class CssAtomsTypingsFile extends File {

  path: string = 'transformations/fdst-web/css-atoms.d.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await cssAtomsTypingsTransformation(
        this.fileCreationResults
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new CssAtomsTypingsFile();