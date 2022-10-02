import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class NpmrcFile extends File {

  path: string = '.npmrc';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
      @${gitHubSettings.username}:registry=https://npm.pkg.github.com
    `;
  }

}

export default new NpmrcFile();