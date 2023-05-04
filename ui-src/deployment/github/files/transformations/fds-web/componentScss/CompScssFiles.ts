import {
  DSysComponentToken,
  DSysToken,
  DTTokenType,
  loopDesignSystemTokens,
  PromiseSequence,
  toKebobCase,
} from "../../../../../../../shared";
import {
  FileCreateResults,
  GitHubSettings,
  MessageRequest,
} from "../../../../../../../shared/types/types";
import postMessagePromise from "../../../../../../utils/postMessagePromise";
import { GithubSuccess } from "../../../../types";
import CompScssFile from "./CompScssFile";

class CompScssFiles {

  async upload(
    gitHubSettings: GitHubSettings,
    updateFeedback: (update: string, doUpdatePercentDone?: boolean) => void,
    fileCreationResults?: FileCreateResults,
  ) : Promise<GithubSuccess> {
    if (
      !fileCreationResults ||
      !fileCreationResults.tokenResults
    ) return {
      success: false,
      message: 'no tokens found.',
    };

    console.log(
      'fileCreationResults.tokenResults',
      fileCreationResults.tokenResults
    );
    const compScssFiles: CompScssFile[] = [];
    loopDesignSystemTokens(
      fileCreationResults.tokenResults.tokens,
      undefined,
      undefined,
      undefined,
      (token: DSysToken) => {
        if (token.$type === DTTokenType.component) {
          const compToken = token as DSysComponentToken;
          const iconName = toKebobCase( compToken.$extensions["dsys.name"] );

          const compScssFile = new CompScssFile();
          compScssFile.path = `transformations/fds-web/components/${iconName}.scss`;
          compScssFile.componentId = compToken.$value;
          // compScssFile.content = compToken.$value.svg;
          compScssFiles.push(compScssFile);
        }
      },
    );

    // cons ole.log('compScssFiles', compScssFiles);
    updateFeedback(`uploading component scss files: transformations/fds-web/components/...`);
    const results = await PromiseSequence(
      compScssFiles.map(compScssFile => {
        return async () : Promise<GithubSuccess> => {
          updateFeedback(`uploading component: ${compScssFile.path}`, false);
          /* return compScssFile.upload(
            gitHubSettings
          ); */
          const compScss = await postMessagePromise(
            MessageRequest.getComponentScss,
            {componentId: compScssFile.componentId}
          );
          console.log('compScss', compScss);
          if (compScss === false) {
            return {
              success: false,
              message:
                `component was not scss-ified id:${compScssFile.componentId}`
            }
          }
          return {
            success: true,
            value: compScss as unknown as string,
          }
        }
      })
    ) as GithubSuccess[];

    // send back an error result if there is one (only need a single one)
    const failure = results.find(result => result.success === false);
    if (failure) {
      return failure;
    }
    return {
      success: true,
      message: 'uploaded icon files.',
    }; 
  }
}

export default new CompScssFiles();