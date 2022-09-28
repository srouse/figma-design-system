import { GitHubSettings } from "../../../../shared/types/types";
import gitHubClient from "../gitHubClient";
import { GithubSuccess, PackageJson } from "../types";

export default async function getVersion(
  gitHubSettings: GitHubSettings
) : Promise<GithubSuccess> {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'Misconfigured for getVersion',
  };

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  let loadSuccess = true;
  let loadMessage = '';
  const results = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    { 
      owner: gitHubSettings.username,
      repo: gitHubSettings.repositoryAndNPMPackageName,
      path: 'package.json'
    }
  ).catch((err: Error) => {
    loadSuccess = false;
    loadMessage = err.message;
  });
  if (!loadSuccess) {
    return {
      success: false,
      message: loadMessage,
    }
  }

  let jsonError = false;
  let packageJson : PackageJson | undefined;
  try {
    packageJson = JSON.parse(atob(results.data.content));
  }catch(error) {
    jsonError = true;
    console.log('getVersion error', error);
  }
  if (jsonError) return {
    success: false,
    message: 'Configuration file did not parse correctly (json).',
  }
  
  if (packageJson && packageJson.version) {
    return {
      success: true,
      value: packageJson.version,
    }
  }
  return {
    success: false,
    message: 'package.json did not have a version',
  };
}

