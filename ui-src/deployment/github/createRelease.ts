import { GitHubSettings } from "../../../shared/types/types";
import gitHubClient from "./gitHubClient";

export default async function createRelease(
  gitHubSettings: GitHubSettings,
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

  const releaseResult = await octokit.repos.createRelease({
    owner: gitHubSettings.username,
    repo: gitHubSettings.repositoryAndNPMPackageName,
    tag_name: `v${gitHubSettings.version}`
  }).catch((err:any) => 
    console.log('error releasing', err)
  );
  
  console.log(releaseResult);
}
