
import {
  GitHubSettings,
} from "../../../../../../../shared";
import { GithubSuccess } from "../../../../types";
import uploadFile from "../../../uploadFile";

export default class CompScssFile {

  path: string = '';
  content: string = '';
  componentId: string = '';

  async upload(
    gitHubSettings: GitHubSettings,
  ) : Promise<GithubSuccess> {
    return uploadFile(
      gitHubSettings,
      this.path,
      this.content,
    );
  }
}
