import { GitHubSettings } from "../../../shared/types/types";
import gitHubClient from "./gitHubClient";

export default async function createRepo(
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

  console.log(
    `No repo found, creating ${gitHubSettings.repositoryAndNPMPackageName}`
  );
  const results = await octokit.request(
    'POST /user/repos',
    { name: gitHubSettings.repositoryAndNPMPackageName }
  ).catch((err: any) => console.log('error', err));

  console.log(results);
  // set 

  return false;
}