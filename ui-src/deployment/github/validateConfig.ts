import { GitHubSettings } from "../../../shared/types/types";
import gitHubClient from "./gitHubClient";

export default async function validateConfig(
  gitHubSettings: GitHubSettings
) {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return;

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  const results = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    { 
      owner: gitHubSettings.username,
      repo: gitHubSettings.repositoryAndNPMPackageName,
      path: 'design-tokens.config.json'
    }
  ).catch((err: any) => console.log('error', err));

  let jsonError = false;
  let configJson : JSONConfig | undefined;
  try {
    configJson = JSON.parse(atob(results.data.content));
  }catch(error) {
    jsonError = true;
    console.log(error);
  }
  if (jsonError) return false;
  
  console.log('Configuration', configJson);
  if (configJson && configJson.builtWith === 'figma-design-tokens') {
    return true;
  }
  return false;
}

type JSONConfig = {
  builtWith: string,
}