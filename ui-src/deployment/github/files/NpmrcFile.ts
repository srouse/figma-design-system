import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class NpmrcFile extends File {

  path: string = '.npmrc';

  getContent(
    gitHubSettings: GitHubSettings,
  ) : string {
    return stripIndent`
      @${gitHubSettings.username}:registry=https://npm.pkg.github.com
    `;
  }

}

export default new NpmrcFile();