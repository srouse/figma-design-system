import Deployment from "./deployment";
import deployToRepo from "./github/deployToRepo";
import { ResponseStatus } from "./github/types";
import { stripIndent } from 'common-tags';

export default async function deployRepoClick(
  comp: Deployment
) {
  comp.setState({
    deployLabel: 'loading...',
    error: undefined
  });
  if (!comp.props.globalData?.gitHubSettings) return;

  const results = await deployToRepo(
    comp.props.globalData?.gitHubSettings,
    (update: string) => comp.setState({
      feedback: update
    })
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
      }
      comp.setState({
        deployLabel: 'Deploy',
        feedback: undefined
      });
      break;
  }
}