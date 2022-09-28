import { GitHubSettings } from "../../../../shared/types/types";
import DesignTokensConfigFile from "../files/DesignTokensConfigFile";
import NpmrcFile from "../files/NpmrcFile";
import PackageFile from "../files/PackageFile";
import PackageLockFile from "../files/PackageLockFile";
import WorkflowReleasePackageFile from "../files/WorkflowReleasePackageFile";
import { GithubSuccess } from "../types";


export default async function uploadFiles(
  gitHubSettings: GitHubSettings,
  updateFeedback: (update: string) => void
) : Promise<GithubSuccess> {
  // update/create all the basic files with version
  // they must be done in series...sha changes...
  const results = [];
  results.push( await DesignTokensConfigFile.upload(gitHubSettings, updateFeedback) );
  results.push( await NpmrcFile.upload(gitHubSettings, updateFeedback) );
  results.push( await PackageFile.upload(gitHubSettings, updateFeedback) );
  results.push( await PackageLockFile.upload(gitHubSettings, updateFeedback) );
  results.push( await WorkflowReleasePackageFile.upload(gitHubSettings, updateFeedback) );

  const errors = results.find((result : GithubSuccess ) => result.success === false);
  console.log('uploadFiles', results);
  if (errors) {
    return {
      success: false,
      message: errors.message,
    }
  }

  return {
    success: true,
  }
}