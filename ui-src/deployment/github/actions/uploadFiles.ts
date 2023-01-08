import { FileCreateResults, GitHubSettings } from "../../../../shared/types/types";
import CssVarsFile from "../files/transformations/fdst-web/CssVarsFile";
import DesignTokensConfigFile from "../files/DesignTokensConfigFile";
import DesignTokensFile from "../files/DesignTokensFile";
import NpmrcFile from "../files/NpmrcFile";
import PackageFile from "../files/PackageFile";
import PackageLockFile from "../files/PackageLockFile";
import ReadMeFile from "../files/ReadMeFile";
import WorkflowReleasePackageFile from "../files/WorkflowReleasePackageFile";
import { GithubSuccess } from "../types";
import CssVarsTypingsFile from "../files/transformations/fdst-web/CssVarsTypingsFile";
import CssAtomsFile from "../files/transformations/fdst-web/CssAtomsFile";
import CssAtomsTypingsFile from "../files/transformations/fdst-web/CssAtomsTypingsFile";
import TSStyleFile from "../files/transformations/fdst-web/TSStyleFile";
import TSReactStyleFile from "../files/transformations/fdst-web/TSReactStyleFile";
import CssFontsFile from "../files/transformations/fdst-web/CssFontsFile";
import CssFile from "../files/transformations/fdst-web/CssFile";
import IconsFiles from "../files/transformations/fdst-web/iconFiles/IconsFiles";
import IconWebComponentFile from "../files/transformations/fdst-web/IconWebComponentFile";

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

  // Transformations
  results.push( await CssVarsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssVarsTypingsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssAtomsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssAtomsTypingsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssFontsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await TSStyleFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await TSReactStyleFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await CssFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  // ICONS
  results.push( await IconsFiles.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await IconWebComponentFile.upload(
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