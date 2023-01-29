import { DSysSheetGroupNames } from "../../../../../../../shared";
import { GitHubSettings } from "../../../../../../../shared/types/types";
import File from "../../../File";
import scssMixinsTransformation from "../utils/scssMixinsTransformation";

class ScssMixinsFile extends File {

  path: string = 'transformations/fdst-web/scss/scss-mixins-typography.scss';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await scssMixinsTransformation(
        this.fileCreationResults,
        DSysSheetGroupNames.type,
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new ScssMixinsFile();