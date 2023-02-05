import {
  FileCreateResults,
  GitHubSettings,
} from "../../../../shared/types/types";
import CssVarsFile from "../files/transformations/fdst-web/CssVarsFile";
import ScssVarsFile from '../files/transformations/fdst-web/scssFiles/ScssVarsFile';
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
import ScssMixinsColorFile from "../files/transformations/fdst-web/scssFiles/ScssMixinsColorFile";
import ScssMixinsLayoutAlignmentFile from "../files/transformations/fdst-web/scssFiles/ScssMixinsLayoutAlignmentFile";
import ScssMixinsTypeFile from "../files/transformations/fdst-web/scssFiles/ScssMixinsTypeFile";
import ScssMixinsSpacingFile from "../files/transformations/fdst-web/scssFiles/ScssMixinsSpacingFile";
import ScssMixinsEffectFile from "../files/transformations/fdst-web/scssFiles/ScssMixinsEffectFile";
import CompScssFiles from "../files/transformations/fdst-web/componentScss/CompScssFiles";
import DesignSystemTypesFile from "../files/DesignSystemTypesFile";
import DesignTokenTypesFile from "../files/DesignTokenTypesFile";

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

  // TypeScript
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