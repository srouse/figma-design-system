import { FileCreateResults, GitHubSettings } from "../../../../shared/types/types";
import CssVarsTransformationFile from "../files/CssVarsTransformationFile";
import DesignTokensConfigFile from "../files/DesignTokensConfigFile";
import DesignTokensFile from "../files/DesignTokensFile";
import NpmrcFile from "../files/NpmrcFile";
import PackageFile from "../files/PackageFile";
import PackageLockFile from "../files/PackageLockFile";
import ReadMeFile from "../files/ReadMeFile";
import WorkflowReleasePackageFile from "../files/WorkflowReleasePackageFile";
import { GithubSuccess } from "../types";

export default async function uploadFiles(
  gitHubSettings: GitHubSettings,
  fileCreationResults: FileCreateResults,
  updateFeedback: (update: string) => void,
) : Promise<GithubSuccess> {
  // update/create all the basic files with version
  // they must be done in series...sha changes...
  const results = [];
  results.push( await ReadMeFile.upload(gitHubSettings, updateFeedback) );
  results.push( await DesignTokensConfigFile.upload(gitHubSettings, updateFeedback) );
  results.push( await NpmrcFile.upload(gitHubSettings, updateFeedback) );
  results.push( await PackageFile.upload(gitHubSettings, updateFeedback) );
  results.push( await PackageLockFile.upload(gitHubSettings, updateFeedback) );
  results.push( await WorkflowReleasePackageFile.upload(gitHubSettings, updateFeedback) );
  results.push( await DesignTokensFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssVarsTransformationFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

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