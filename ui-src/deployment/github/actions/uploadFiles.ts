import {
  FileCreateResults,
  GitHubSettings,
} from "../../../../shared/types/types";
import CssVarsFile from "../files/transformations/fds-web/CssVarsFile";
import ScssVarsFile from '../files/transformations/fds-web/scssFiles/ScssVarsFile';
import DesignTokensConfigFile from "../files/DesignTokensConfigFile";
import DesignTokensFile from "../files/DesignTokensFile";
import NpmrcFile from "../files/NpmrcFile";
import PackageFile from "../files/PackageFile";
import PackageLockFile from "../files/PackageLockFile";
import ReadMeFile from "../files/ReadMeFile";
import WorkflowReleasePackageFile from "../files/WorkflowReleasePackageFile";
import { GithubSuccess } from "../types";
import CssVarsTypingsFile from "../files/transformations/fds-web/CssVarsTypingsFile";
import CssAtomsFile from "../files/transformations/fds-web/CssAtomsFile";
import CssAtomsTypingsFile from "../files/transformations/fds-web/CssAtomsTypingsFile";
import TSStyleFile from "../files/transformations/fds-web/TSStyleFile";
import TSReactStyleFile from "../files/transformations/fds-web/TSReactStyleFile";
import CssFontsFile from "../files/transformations/fds-web/CssFontsFile";
import CssFile from "../files/transformations/fds-web/CssFile";
import IconsFiles from "../files/transformations/fds-web/iconFiles/IconsFiles";
import IconWebComponentFile from "../files/transformations/fds-web/IconWebComponentFile";
import ScssMixinsColorFile from "../files/transformations/fds-web/scssFiles/ScssMixinsColorFile";
import ScssMixinsLayoutAlignmentFile from "../files/transformations/fds-web/scssFiles/ScssMixinsLayoutAlignmentFile";
import ScssMixinsTypeFile from "../files/transformations/fds-web/scssFiles/ScssMixinsTypeFile";
import ScssMixinsSpacingFile from "../files/transformations/fds-web/scssFiles/ScssMixinsSpacingFile";
import ScssMixinsEffectFile from "../files/transformations/fds-web/scssFiles/ScssMixinsEffectFile";
import CompScssFiles from "../files/transformations/fds-web/componentScss/CompScssFiles";
import DesignSystemTypesFile from "../files/DesignSystemTypesFile";
import DesignTokenTypesFile from "../files/DesignTokenTypesFile";
import JavaScriptVarsFile from "../files/transformations/fds-web/JavascriptVarsFile";
import TypescriptVarsFile from "../files/transformations/fds-web/TypescriptVarsFile";

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

  // CSS
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

  // SCSS
  results.push( await ScssVarsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await ScssMixinsLayoutAlignmentFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await ScssMixinsColorFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await ScssMixinsTypeFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await ScssMixinsSpacingFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await ScssMixinsEffectFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

  // Javascript
  results.push( await JavaScriptVarsFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

  // TypeScript
  results.push( await TypescriptVarsFile.upload(
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
  results.push( await DesignTokenTypesFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await DesignSystemTypesFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

  // ICONS
  results.push( await IconsFiles.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));
  results.push( await IconWebComponentFile.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

  // COMPONENT SCSS
  results.push( await CompScssFiles.upload(
    gitHubSettings, updateFeedback, fileCreationResults,
  ));

  const errors = results.find(
    (result : GithubSuccess ) => result.success === false
   );
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