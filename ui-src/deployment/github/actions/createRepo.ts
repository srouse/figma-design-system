import { GitHubSettings } from "../../../../shared/types/types";
import gitHubClient from "../gitHubClient";
import { GithubSuccess } from "../types";

export default async function createRepo(
  gitHubSettings: GitHubSettings
) : Promise<GithubSuccess> {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'Misconfigured for createRepo'
  };

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  let success = true;
  let message = '';
  await octokit.request(
    'POST /user/repos',
    { name: gitHubSettings.repositoryAndNPMPackageName }
  ).catch((err: Error) => {
    success = false;
    message = err.message;
  });

  return {
    success,
    message,
  }
}