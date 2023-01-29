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
            "license": "MIT",
            "dependencies": {
              "csstype": "^3.1.1"
            },
            "devDependencies": {}
          }
        },
        "dependencies": {
          "csstype": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.1.1.tgz",
            "integrity": "sha512-DJR/VvkAvSZW9bTouZue2sSxDwdTN92uHjqeKVm+0dAqdfNykRzQ95tay8aXMBAAPpUiq4Qcug2L7neoRh2Egw=="
          }
        }
      }
    `;
  }

}

export default new PackageLockFile();