

export default async function gitHubClient() {
  // thwarting compiler to load this at runtime...
  const Octokit = await eval(`(async () => { 
    const a = await import("https://cdn.skypack.dev/@octokit/rest");
    return a.Octokit;
  })()`);
  return Octokit;
}