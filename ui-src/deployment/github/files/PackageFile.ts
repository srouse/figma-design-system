import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class NpmrcFile extends File {

  path: string = 'package.json';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
      {
        "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
        "version": "v${gitHubSettings.version}",
        "main": "index.js",
        "repository": "git@github.com:${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}.git"
      }
    `;
  }

}

export default new NpmrcFile();