import { GitHubSettings } from "../../../../shared/types/types";
import { GithubSuccess } from "../types";
import uploadFile from "./uploadFile";

export default class File {

  path: string = '';

  getContent(
    gitHubSettings: GitHubSettings,
  ) : string {
    return `no content ${gitHubSettings.version}`;
  }

  async upload(
    gitHubSettings: GitHubSettings,
    updateFeedback: (update: string) => void
  ) : Promise<GithubSuccess> {
    updateFeedback(`uploading file: ${this.path}`);
    let success = true;
    let message = '';
    await uploadFile(
      gitHubSettings,
      this.path,
      this.getContent(gitHubSettings),
    ).catch((err: Error) => {
      success = false;
      message = err.message;
    });

    return {
      success,
      message,
    }
  }
}