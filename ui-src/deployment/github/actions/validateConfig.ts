import { GitHubSettings } from "../../../../shared/types/types";
import { FDST_CONFIG_FILENAME } from "../files/DesignTokensConfigFile";
import gitHubClient from "../gitHubClient";
import { GithubSuccess, JSONConfig } from "../types";

export const FDST_IDENTIFIER = 'figma-design-system-tokens';

export default async function validateConfig(
  gitHubSettings: GitHubSettings
) : Promise<GithubSuccess> {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'Misconfigured for validateConfig',
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
      path: FDST_CONFIG_FILENAME
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
  let configJson : JSONConfig | undefined;
  try {
    configJson = JSON.parse(atob((results as any).data.content));
  }catch(error) {
    jsonError = true;
    console.error('validateConfig error', error);
  }
  if (jsonError) return {
    success: false,
    message: 'Configuration file did not parse correctly (json).',
  }
  
  if (configJson && configJson.builtWith === FDST_IDENTIFIER) {
    return {success: true}
  }
  return {
    success: false,
    message: `The builtWith property was not for ${FDST_IDENTIFIER}`,
  };
}

