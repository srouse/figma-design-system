import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { designSystemTypes } from "../../../../shared";

class DesignSystemTypesFile extends File {

  path: string = 'designSystemTypes.ts';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return designSystemTypes;
  }

}

export default new DesignSystemTypesFile();