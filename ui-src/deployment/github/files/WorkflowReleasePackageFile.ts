import { GitHubSettings } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';

class WorkflowReleasePackageFile extends File {

  // requires workflow permissions....
  path: string = '.github/workflows/release-package.yml';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    return stripIndent`
      name: Node.js Package

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
                NODE_AUTH_TOKEN: \${{secrets.GITHUB_TOKEN}}
    `;
  }

}

export default new WorkflowReleasePackageFile();