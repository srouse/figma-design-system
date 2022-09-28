import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class DesignTokensConfigFile extends File {

  path: string = 'design-tokens.config.json';

  getContent(
    gitHubSettings: GitHubSettings,
  ) : string {
    return stripIndent`
    {
      "name":       "${gitHubSettings.repositoryAndNPMPackageName}",
      "builtWith":  "figma-design-tokens"
    }`;
  }

}

export default new DesignTokensConfigFile();