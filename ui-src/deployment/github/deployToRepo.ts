import {
  FileCreateResults,
  GitHubSettings
} from "../../../shared/types/types";
import repositoryExists from "./actions/repositoryExists";
import validateConfig from "./actions/validateConfig";
import uploadFiles from "./actions/uploadFiles";
import createRelease from "./actions/createRelease";
import {
  GithubResult,
  ResponseStatus,
  VersionIncrements,
} from "./types";
import getVersion from "./actions/getVersion";
import semvar from "./semver";

export const TOTAL_FILES_TO_DEPLOY = 20;

export default async function deployToRepo(
  gitHubSettings: GitHubSettings,
  versionLevel: VersionIncrements,
  updateFeedback: (update: string) => void
) : Promise<GithubResult> {

  updateFeedback('checking if repo exists');
  const repositoryExistsResults = await repositoryExists(gitHubSettings);
  if (!repositoryExistsResults.success) {
    return {
      status:ResponseStatus.NoRepo,
      message: repositoryExistsResults.message,
    };
  }

  // see if repository has correct config...
  updateFeedback('checking configuration')
  const validateConfigResults = await validateConfig(gitHubSettings);
  if (!validateConfigResults.success) {
    return {
      status: ResponseStatus.BadConfig,
      message: validateConfigResults.message,
    };
  }

  // get the package file and increment version
  const versionResults = await getVersion(
    gitHubSettings
  );
  if (!versionResults) {
    return {
      status: ResponseStatus.VersionFailed,
      message: 'Could not find version',
    };
  }

  // Create incremented github settings
  const newGitHubSettings : GitHubSettings = {
    ...gitHubSettings,
    version: semvar(
      versionResults.value,
      versionLevel,
    )
  };

  // UPLOAD FILES
  // need to make sure everything will work and has the correct version...
  const fileCreationResults: FileCreateResults = {};
  const uploadFilesResults = await uploadFiles(
    newGitHubSettings,
    fileCreationResults,
    updateFeedback,
  );
  if (uploadFilesResults.success !== true) {
    return {
      status: ResponseStatus.UploadFilesFailed,
      message: uploadFilesResults.message,
    }
  }

  // TRANSFORM
  console.log('fileCreationResults', fileCreationResults);

  // RELEASE
  updateFeedback('creating release');
  const createReleaseResults = await createRelease(newGitHubSettings);
  if (createReleaseResults.success !== true) {
    return {
      status: ResponseStatus.ReleaseFailed,
      message: createReleaseResults.message,
    }
  }

  console.log('versionResults', versionResults);

  return {
    status:ResponseStatus.RepoValid,
    value: newGitHubSettings,
  };
}

