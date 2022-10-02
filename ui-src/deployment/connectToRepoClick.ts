import connectToRepo from "./github/connectToRepo";
import { ResponseStatus } from "./github/types";
import DeployModal from "./modal/deployModal";

export default async function connectToRepoClick(
  comp: DeployModal
) {
  comp.setState({
    error: undefined,
    percentDone: 0,
  });
  if (!comp.props.globalData?.gitHubSettings) return;

  let expectedTotal = 2;
  let total = 0;
  const results = await connectToRepo(
    comp.props.globalData?.gitHubSettings,
    (update: string) => {
      total++;
      comp.setState({
        feedback: update,
        percentDone: total/expectedTotal
      });
    },
    (totalSteps: number) => {
      expectedTotal = totalSteps;
    }
  );

  switch (results.status) {
    case ResponseStatus.BadConfig:
      comp.setState({
        feedback: undefined,
        error: `Error. This appears to be a pre-existing
        repository or one not for use with the Design Tokens
        widget. Choose an empty repository or check the 
        design-tokens.config.json file {builtWith:'figma-design-tokens'}`
      });
      break;
    case ResponseStatus.ReleaseFailed :
    case ResponseStatus.CreateRepoFailed:
    case ResponseStatus.NoRepo:
    case ResponseStatus.UploadFilesFailed:
    case ResponseStatus.VersionFailed:
        comp.setState({
          feedback: undefined,
          error: results.message,
        });
        break;
    case ResponseStatus.RepoValid:
      const newGitHubSettings = 
        results.value || comp.props.globalData.gitHubSettings;
      comp.props.updateGlobalData({
        ...comp.props.globalData,
        gitHubSettings: {
          ...newGitHubSettings,
          connected: true,
        }
      });
      comp.setState({
        feedback: undefined
      });
      break;
  }

  comp.setState({
    finished: true
  });
}