import { GitHubSettings } from "../../../shared/types/types";

// the core requests will need to give more nuanced results...
export type GithubResult = {
  status: ResponseStatus,
  message?: string,
  value?: GitHubSettings,
};

// For simplier boolean successes
export type GithubSuccess = {
  success: boolean,
  message?: string,
  value?: string,
};

export enum ResponseStatus {
  NoRepo = 'NoRepo',
  BadConfig = 'BadConfig',
  RepoValid = 'RepoValid',
  UploadFilesFailed = 'UploadFilesFailed',
  CreateRepoFailed = 'CreateRepoFailed',
  VersionFailed = 'VersionFailed',
  ReleaseFailed = 'ReleaseFailed',
}

export type JSONConfig = {
  builtWith: string,
}

export type PackageJson = {
  version: string,
}