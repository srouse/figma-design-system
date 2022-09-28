import { GitHubSettings } from "../../../../shared/types/types";
import gitHubClient from "../gitHubClient";
import { GithubSuccess } from "../types";

export default async function repositoryExists(
  gitHubSettings: GitHubSettings
) : Promise<GithubSuccess> {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'Misconfigured for repositoryExists',
  };

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });


  const results = await octokit.request(
    'GET /users/{username}/repos',
    { username: gitHubSettings.username }
  ).catch((err: any) => {

  });

  if (results) {
    const exists = results.data.find((repo: any) => {
      return repo.full_name === `${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}`;
    });
    return {
      success: exists ? true : false,
      message: exists ? '' : 'Repository not found.'
    };
  }
  return {
    success:false,
    message: 'Service did not send results',
  };
}