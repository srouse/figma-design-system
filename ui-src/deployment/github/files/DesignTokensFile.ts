import {
  GitHubSettings,
  MessageRequest,
} from "../../../../shared/";
import File from "./File";
import postMessagePromise from "../../../utils/postMessagePromise";

class DesignTokensFile extends File {

  path: string = 'design.tokens.json';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {

    const tokensResults: any = await postMessagePromise(
      MessageRequest.getFinalTokens
    );

    if (this.fileCreationResults) {
      this.fileCreationResults.tokenResults = tokensResults.designTokenResults;
    }

    /*if (
      tokensResult &&
      tokensResult.designTokenResults &&
      tokensResult.designTokenResults.errors &&
      tokensResult.designTokenResults.errors.length > 0
    ) {
      return tokensResult.designTokenResults.errors[0];
    }*/

    if (
      tokensResults &&
      tokensResults.designTokenResults &&
      tokensResults.designTokenResults.tokens
    ) {
      return JSON.stringify(tokensResults.designTokenResults.tokens, null, 2);
    }
    return 'Error, tokens not found'
  }

}

export default new DesignTokensFile();