import { FDST_IDENTIFIER } from "../actions/validateConfig";
import connectToRepo from "../connectToRepo";
import { FDST_CONFIG_FILENAME } from "../files/DesignTokensConfigFile";
import { ResponseStatus } from "../types";
import DeployModal from "./deployModal";

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
        widget. The widget will create and configure your Github repo
        for you, so enter a name of a repository that does NOT exist or
        check that your configuration file has not been changed:
        ${FDST_CONFIG_FILENAME} {builtWith:'${FDST_IDENTIFIER}'}`
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
          deployed: newGitHubSettings.version != '0.0.0',
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