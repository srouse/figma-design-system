import { GitHubSettings } from "../../../shared/types/types";
import createRepo from "./actions/createRepo";
import repositoryExists from "./actions/repositoryExists";
import validateConfig from "./actions/validateConfig";
import uploadFiles from "./actions/uploadFiles";
import { ResponseStatus, GithubResult } from "./types";
import getVersion from "./actions/getVersion";

export default async function connectToRepo(
  gitHubSettings: GitHubSettings,
  updateFeedback: (update: string) => void,
  updateTotalSteps: (total: number) => void,
) : Promise<GithubResult> {

  updateTotalSteps(8);
  // see if repository exists
  updateFeedback('checking if repo exists');
  const repositoryExistsResults = await repositoryExists(gitHubSettings);
  if (!repositoryExistsResults.success) {
    // Does NOT exist, so we can make it...
    gitHubSettings.version = '0.0.1';// always starts here...

    // lets create one...
    updateFeedback('creating repo');
    const createRepoResults = await createRepo(gitHubSettings);
    if (!createRepoResults.success) {
      return {
        status: ResponseStatus.CreateRepoFailed,
        message: createRepoResults.message,
      };
    }

    const uploadFilesResults = await uploadFiles(
      gitHubSettings,
      updateFeedback
    );
    if (!uploadFilesResults.success) {
      return {
        status: ResponseStatus.UploadFilesFailed,
        message: uploadFilesResults.message,
      };
    }
  }else{
    updateTotalSteps(2);
  }

  // see if repository has correct config now...
  updateFeedback('checking configuration')
  const validateConfigResults = await validateConfig(gitHubSettings);
  if (!validateConfigResults.success) {
    return {
      status: ResponseStatus.BadConfig,
      message: validateConfigResults.message,
    };
  }

  // Get the version in case it is a reconnect...
  const versionResults = await getVersion(gitHubSettings);
  if (!versionResults) {
    return {
      status: ResponseStatus.VersionFailed,
      message: 'Could not find version',
    };
  }

  return {
    status: ResponseStatus.RepoValid,
    value: {
      ...gitHubSettings,
      version: versionResults.value ? 
        versionResults.value.replace('v', '') :
        '0.0.1',
    }
  }
}


