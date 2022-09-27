import { GitHubSettings } from "../../../shared/types/types";
import gitHubClient from "./gitHubClient";


export default async function repositoryExists(
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
    'GET /users/{username}/repos',
    { username: gitHubSettings.username }
  ).catch((err: any) => console.log('error', err));

  if (results) {
    const exists = results.data.find((repo: any) => {
      return repo.full_name === `${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}`;
    });
    return exists ? true : false;
  }
  return false;
}