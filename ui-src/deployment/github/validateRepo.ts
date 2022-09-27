import { GitHubSettings } from "../../../shared/types/types";
import createRelease from "./createRelease";
import createRepo from "./createRepo";
import repositoryExists from "./repositoryExists";
import uploadFile from "./uploadFile";
import validateConfig from "./validateConfig";

/**
 * Workflow
 * 
 * Enter Details > Validate...
 * 
 * Validate first looks for repo...
 * 
 * If No, then prompt to create a new one...
 * 
 * If Yes...
 * 
 * Validate looks for design-tokens.config.json
 * 
 *  {
 *    name:       'My Tokens',
 *    author:     'Dude McDudey',
 *    version:    'v0.0.2',
 *    createdBy:  'figma-design-tokens',
 *  }
 * 
 * if found, it opens and checks for information confirming it's createdBy this
 * 
 * GitHub then locks and we can assume everything can be overwritten...
 * 
 * if not found or built by is wrongm, then block the use of this repo 
 * 
 */ 

export default async function validateRepo(
  gitHubSettings: GitHubSettings,
  updateFunk: (update: string) => void
) : Promise<ValidationResponses> {
  // see if repository exists

  updateFunk('checking if repo exists');
  if (!(await repositoryExists(gitHubSettings))) {

    gitHubSettings.version = '0.0.1';

    // lets create one...
    updateFunk('creating repo');
    await createRepo(gitHubSettings);

    // now lets update a default config file...
    updateFunk('adding design-tokens.config.json file');
    await uploadFile(
      gitHubSettings,
      'design-tokens.config.json',
`{
  "name":       "${gitHubSettings.repositoryAndNPMPackageName}",
  "version":    "v${gitHubSettings.version}",
  "builtWith":  "figma-design-tokens"
}
`   );

    updateFunk('adding .npmrc file');
    await uploadFile(
      gitHubSettings,
      '.npmrc',
      `@${gitHubSettings.username}:registry=https://npm.pkg.github.com`
    );

    await uploadFile(
      gitHubSettings,
      'package.json',
`{
  "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
  "version": "v${gitHubSettings.version}",
  "main": "index.js",
  "repository": "git@github.com:${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}.git"
}`
    );

    updateFunk('adding package-lock.json file');
    await uploadFile(
      gitHubSettings,
      'package-lock.json',
`{
  "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "name": "@${gitHubSettings.username}/${gitHubSettings.repositoryAndNPMPackageName}",
      "version": "${gitHubSettings.version}",
      "license": "MIT"
    }
  }
}`
    );

    updateFunk('adding workflow');
    await uploadFile(
      gitHubSettings,
      '.github/workflows/release-package.yml',
`name: Node.js Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 12
      - run: npm ci
      - run: npm test

  publish-gpr:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      packages: write
      contents: read
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 12
          registry-url: https://npm.pkg.github.com/
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: \${{secrets.GITHUB_TOKEN}}`
    );
  }

  updateFunk('creating release');
  await createRelease(gitHubSettings);

  // see if repository has correct config...
  updateFunk('checking configuration')
  if (!(await validateConfig(gitHubSettings)))
    return ValidationResponses.BadConfig;

  return ValidationResponses.RepoValid;
}

export enum ValidationResponses {
  NoRepo = 'NoRepo',
  BadConfig = 'BadConfig',
  RepoValid = 'RepoValid'
}
