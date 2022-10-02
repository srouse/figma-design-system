import { GitHubSettings, MessageRequest } from "../../../../shared/types/types";
import File from "./File";
import { stripIndent } from 'common-tags';
import postMessagePromise from "../../../utils/postMessagePromise";

class DesignTokensFile extends File {

  path: string = 'design.tokens.json';

  async getContent(
    gitHubSettings: GitHubSettings,
  ) : Promise<string> {

    const tokens: any = await postMessagePromise(
      MessageRequest.getFinalTokens
    );

    if (tokens && tokens.tokens) {
      return JSON.stringify(tokens.tokens, null, 2);
    }
    return 'Error, tokens not found'
  }

}

export default new DesignTokensFile();