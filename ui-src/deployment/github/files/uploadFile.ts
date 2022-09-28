import { GitHubSettings } from "../../../../shared/types/types";
import { Base64 } from 'js-base64';
import gitHubClient from "../gitHubClient";
import { GithubSuccess } from "../types";

export default async function uploadFile(
  gitHubSettings: GitHubSettings,
  path : string,
  content: string,
) : Promise<GithubSuccess>{
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'uploadFile misconfigured',
  };

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  const sha = await getSHA(octokit, gitHubSettings, path);
  let success = true;
  let message = `uploaded file: ${path}`;
  await octokit.request(
    'PUT /repos/{owner}/{repo}/contents/{path}',
    {
      owner: gitHubSettings.username,
      repo: gitHubSettings.repositoryAndNPMPackageName,
      path,
      message: sha ? 
        `Updated file: "${path}"` :
        `Create file: "${path}"`,
      content: Base64.encode(`${content}`),
      sha,
    }).catch((err:any) => {
      success = false;
      message = `file failed upload ${path} error:${err.message}`
    });

  return {
    success,
    message,
  };
}

async function getSHA(
  octokit: any,
  gitHubSettings: GitHubSettings,
  path: string
) {
  const result = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: gitHubSettings.username,
      repo: gitHubSettings.repositoryAndNPMPackageName,
      path,
    }
  ).catch((err:any) => {
    console.log('error getting sha', err);
  });

  const sha = result?.data?.sha;
  return sha;
}