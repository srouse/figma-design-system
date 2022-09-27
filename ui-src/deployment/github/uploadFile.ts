import { GitHubSettings } from "../../../shared/types/types";
import { Base64 } from 'js-base64';
import gitHubClient from "./gitHubClient";

export default async function uploadFile(
  gitHubSettings: GitHubSettings,
  path : string,
  content: string,
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

  const sha = await getSHA(octokit, gitHubSettings, path);
  console.log("SHA", sha);
  console.log('path', path)
  const result = await octokit.request(
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
    console.log('error commiting', err);
  });

  /*const releaseResult = await octokit.repos.createRelease({
    owner: "srouse",
    repo: "javascript-to-github",
    tag_name: `v${bumpedVersion}`
  }).catch((err:any) => 
    console.log('error releasing', err)
  );*/
  
  console.log(result);
  // return result?.status || releaseResult?.status || 500;
}

async function getSHA(
  octokit: any,
  gitHubSettings: GitHubSettings,
  path: string
) {
  const result = await octokit.repos.getContent({
    owner: gitHubSettings.username,
    repo: gitHubSettings.repositoryAndNPMPackageName,
    path,
  }).catch((err:any) => {
    console.log('error releasing', err);
  });
  const sha = result?.data?.sha;
  return sha;
}