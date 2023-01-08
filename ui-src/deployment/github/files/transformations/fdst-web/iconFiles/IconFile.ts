
import {
  FileCreateResults,
  GitHubSettings,
} from "../../../../../../../shared";
import { GithubSuccess } from "../../../../types";
import uploadFile from "../../../uploadFile";

export default class IconFile {

  path: string = '';
  content: string = '';

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
