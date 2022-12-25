import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';
import { FDST_IDENTIFIER } from "../actions/validateConfig";

export const FDST_CONFIG_FILENAME = 'design.tokens.config.json';

class DesignTokensConfigFile extends File {

  path: string = FDST_CONFIG_FILENAME;

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
    {
      "name":       "${gitHubSettings.repositoryAndNPMPackageName}",
      "builtWith":  "${FDST_IDENTIFIER}"
    }`;
  }

}

export default new DesignTokensConfigFile();