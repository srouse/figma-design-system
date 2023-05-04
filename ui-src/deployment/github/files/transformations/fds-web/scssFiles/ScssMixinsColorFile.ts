import { DSysSheetGroupNames } from "../../../../../../../shared";
import { GitHubSettings } from "../../../../../../../shared/types/types";
import File from "../../../File";
import scssMixinsTransformation from "../utils/scssMixinsTransformation";

class ScssMixinsFile extends File {

  path: string = 'transformations/fds-web/scss/scss-mixins-colors.scss';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      this.fileCreationResults &&
      this.fileCreationResults.tokenResults
    ) {
      const transformationResults = await scssMixinsTransformation(
        this.fileCreationResults,
        DSysSheetGroupNames.color,
      );
      return transformationResults?.content || 'tokens not found';
    }else{
      return '/* tokens not found */';
    }
  }
}

export default new ScssMixinsFile();