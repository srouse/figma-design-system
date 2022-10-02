import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class PackageLockFile extends File {

  path: string = 'package-lock.json';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
      {
        "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
        "version": "1.0.0",
        "lockfileVersion": 2,
        "requires": true,
        "packages": {
          "": {
            "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
            "version": "${gitHubSettings.version}",
            "license": "MIT"
          }
        }
      }
    `;
  }

}

export default new PackageLockFile();