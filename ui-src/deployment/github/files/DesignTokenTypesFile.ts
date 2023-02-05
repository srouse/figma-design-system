import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { designTokenTypes } from "../../../../shared";

class DesignTokenTypesFile extends File {

  path: string = 'designTokensTypes.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return designTokenTypes;
  }

}

export default new DesignTokenTypesFile();