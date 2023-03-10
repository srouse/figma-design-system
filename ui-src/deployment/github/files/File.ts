import { FileCreateResults, GitHubSettings } from "../../../../shared/types/types";
import { GithubSuccess } from "../types";
import uploadFile from "./uploadFile";

export default class File {

  path: string = '';
  fileCreationResults?: FileCreateResults;

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return `no content ${gitHubSettings.version}`;
  }

  async upload(
    gitHubSettings: GitHubSettings,
    updateFeedback: (update: string) => void,
    fileCreationResults?: FileCreateResults,
  ) : Promise<GithubSuccess> {
    this.fileCreationResults = fileCreationResults;
    updateFeedback(`uploading file: ${this.path}`);
    const content = await this.getContent(gitHubSettings);
    return uploadFile(
      gitHubSettings,
      this.path,
      content,
    );
  }
}