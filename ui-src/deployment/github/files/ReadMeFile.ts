import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class ReadMeFile extends File {

  path: string = 'README.md';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
      # ${gitHubSettings.repositoryAndNPMPackageName}
      
      built with Figma Design System Tokens (do not edit directly)
    `;
  }

}

export default new ReadMeFile();