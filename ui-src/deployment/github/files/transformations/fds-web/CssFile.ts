import { findTokensSheet } from "../../../../../../shared";
import { GitHubSettings } from "../../../../../../shared/types/types";
import File from "../../File";

class CssFile extends File {

  path: string = 'transformations/fds-web/{prefix}.css';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {
    if (
      !this.fileCreationResults ||
      !this.fileCreationResults.tokenResults
    ) {
      return 'no tokens';
    }
    const dsys = this.fileCreationResults.tokenResults.tokens;
    if (!dsys) return 'no tokens';
    const tokenSheet = findTokensSheet(dsys);
    if (!tokenSheet) return 'no tokensheet';
    const prefix = tokenSheet.$extensions["dsys.prefix"].toLowerCase();

    this.path = `transformations/fds-web/${prefix.toLowerCase()}.css`;

    return `@import "./css-vars.css";
@import "./css-atoms.css";
@import "./css-fonts.css";`
  }
}

export default new CssFile();