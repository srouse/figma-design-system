import Deployment from "./deployment";
import connectToRepo from "./github/connectToRepo";
import { ResponseStatus } from "./github/types";


export default async function connectToRepoClick(
  comp: Deployment
) {
  comp.setState({
    validateLabel: 'loading...',
    error: undefined
  });
  if (!comp.props.globalData?.gitHubSettings) return;
  const results = await connectToRepo(
    comp.props.globalData?.gitHubSettings,
    (update: string) => comp.setState({
      feedback: update
    })
  );
  switch (results.status) {
    case ResponseStatus.BadConfig:
      comp.setState({
        validateLabel: 'Connect To Repository',
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
          validateLabel: 'Connect to Repository',
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
        validateLabel: 'Connect To Repository',
        feedback: undefined
      });
      break;
  }
}