import { GitHubSettings } from "../../../../shared/types/types";
import gitHubClient from "../gitHubClient";
import { GithubSuccess } from "../types";

export default async function createRelease(
  gitHubSettings: GitHubSettings,
) : Promise<GithubSuccess> {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) return {
    success: false,
    message: 'error: settings misconfigured',
  }

  const Octokit = await gitHubClient();  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  let success = true;
  let message: string | undefined;

  await octokit.repos.createRelease({
    owner: gitHubSettings.username,
    repo: gitHubSettings.repositoryAndNPMPackageName,
    tag_name: `v${gitHubSettings.version}`
  }).catch((err : Error) => {
    success = false;
    message = err.message;
  })

  return {
    success,
    message,
  }
}
