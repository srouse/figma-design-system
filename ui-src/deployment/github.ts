import { GitHubSettings } from "../../shared/types/types";

export async function validate(
  gitHubSettings: GitHubSettings
) {
  if (
    !gitHubSettings.username ||
    !gitHubSettings.repositoryAndNPMPackageName ||
    !gitHubSettings.version
  ) 
    return;
  
  // thwarting compiler to load this at runtime...
  const Octokit = await eval(`(async () => { 
    const a = await import("https://cdn.skypack.dev/@octokit/rest");
    return a.Octokit;
  })()`);

  console.log(Octokit);
  
  const octokit = new Octokit({
    auth: gitHubSettings.accessToken,
  });

  await octokit.rest.repos
    .listPublic()
    .then((result: any) => {
      // handle data
      console.log('data', result);
    });

  const result = await octokit.repos.getContent({
    owner: gitHubSettings.username,
    repo: gitHubSettings.repositoryAndNPMPackageName,
    path: 'package.json',
  }).catch((err: any) => console.log('error', err));

  console.log(atob(result.data.content), gitHubSettings);
}