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
  const results = await Promise.all([
    DesignTokensConfigFile.upload(gitHubSettings, updateFeedback),
    NpmrcFile.upload(gitHubSettings, updateFeedback),
    PackageFile.upload(gitHubSettings, updateFeedback),
    PackageLockFile.upload(gitHubSettings, updateFeedback),
    WorkflowReleasePackageFile.upload(gitHubSettings, updateFeedback),
  ]);

  const errors = results.find((result : GithubSuccess ) => result.success === false);
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