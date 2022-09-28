import deployToRepo from "./github/deployToRepo";
import { ResponseStatus } from "./github/types";
import { stripIndent } from 'common-tags';
import DeployModal from "./modal/deployModal";

export default async function deployRepoClick(
  comp: DeployModal
) {
  comp.setState({
    error: undefined,
    percentDone: 0,
  });
  if (!comp.props.globalData?.gitHubSettings) return;

  const expectedTotal = 8;
  let total = 0;
  const results = await deployToRepo(
    comp.props.globalData?.gitHubSettings,
    comp.props.versionIncrement,
    (update: string) => {
      total++;
      comp.setState({
        feedback: update,
        percentDone: total/expectedTotal
      });
    }
  );

  switch (results.status) {
    case ResponseStatus.BadConfig:
      comp.setState({
        feedback: undefined,
        error: `Error. This repository is not for use with the Design Tokens
        widget, it doesn't have the appropriate design-tokens.config.json 
        file. Choose an empty repository or check the 
        design-tokens.config.json file {builtWith:'figma-design-tokens'}`
      });
      comp.props.updateGlobalData({
        ...comp.props.globalData,
        gitHubSettings: {
          ...comp.props.globalData.gitHubSettings,
          connected: false,
        }
      });
      break;
    case ResponseStatus.ReleaseFailed :
      comp.setState({
        feedback: undefined,
        error: stripIndent`
          Release failed, check if a release with the same version 
          (${comp.props.globalData?.gitHubSettings.version}) exists.`
      });
      break;
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
      if (results.value) {
        comp.props.updateGlobalData({
          ...comp.props.globalData,
          gitHubSettings: {
            ...results.value,
          }
        });
        comp.setState({
          feedback: `Deployed ${results.value.version}`
        });
      }else{
        comp.setState({
          feedback: `Deployed with unknown version`
        });
      }
      break;
  }

  comp.setState({
    finished: true
  });
}