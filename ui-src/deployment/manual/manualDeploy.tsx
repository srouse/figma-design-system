import React from "react";
import {
  CoreProps, Icons, MessageRequest,
} from "../../../shared";
import "./manualDeploy.css";
import postMessagePromise from "../../utils/postMessagePromise";
import DTTabs from "../../components/DTTabs";
import { FileCreateResults, FileTypes } from "../../../shared/types/types";
import variablesTransformation from "../github/files/transformations/fds-web/utils/variablesTransformation";
import cssFontsTransformation from "../github/files/transformations/fds-web/utils/cssFontsTransformation";
import cssAtomsTransformation from "../github/files/transformations/fds-web/utils/cssAtomsTransformation";
import javascriptVarsTransformation from "../github/files/transformations/fds-web/utils/javascriptVarsTransformation";
import DTButton, { DTButtonColor } from "../../components/DTButton";
import * as mixpanel from '../../utils/mixpanel';

interface ManualDeployProps extends CoreProps {
}

export default class ManualDeploy extends React.Component<ManualDeployProps> {

  constructor(props: ManualDeployProps | Readonly<ManualDeployProps>) {
    super(props);
    this.state = {
      code: '',
      codeType: FileTypes.Tokens
    };
    this.changeCodeType(FileTypes.Tokens);
  }

  state: {
    code: string,
    codeType: FileTypes
  };

  async refreshCode() {
    return this.changeCodeType(this.state.codeType);
  }

  async changeCodeType(value: FileTypes) {
    mixpanel.track('download-changed-code-type', {
      codeType: value
    });
    this.setState({codeType:value});
    const tokensResults: any = await postMessagePromise(
      MessageRequest.getFinalTokens
    );
    const fileCreateResults: FileCreateResults = {
      tokenResults: tokensResults.designTokenResults,
    }
    switch(this.state.codeType) {
      case FileTypes.Tokens: 
        this.setState({
          code: JSON.stringify(
              tokensResults.designTokenResults.tokens, null, 2
            ),
        });
        break;
      case FileTypes.CssVars:
        const cssVars = await variablesTransformation(
          fileCreateResults
        );
        this.setState({
          code: cssVars?.content
        });
        break;
      case FileTypes.CssFonts:
        const cssFonts = await cssFontsTransformation(
          fileCreateResults
        );
        this.setState({
          code: cssFonts?.content
        });
        break;
      case FileTypes.CssAtoms:
        const cssAtoms = await cssAtomsTransformation(
          fileCreateResults
        );
        this.setState({
          code: cssAtoms?.content
        });
        break;
      case FileTypes.JavaScript:
        const test = await javascriptVarsTransformation(
          fileCreateResults
        );
        this.setState({
          code: test?.content
        });
        break;
      default: {
        this.setState({
          code: 'Code not found',
        });
        break;
      }
    }
  }

  render() {
    return (
      <div className="manual-deploy">
        {/*<InputHeader
          label="Download" />*/}
        <DTTabs
            tabs={[
            {name: 'Tokens', value: FileTypes.Tokens},
            {name: 'CSS Vars', value: FileTypes.CssVars},
            {name: 'CSS Fonts', value: FileTypes.CssFonts},
            // {name: 'CSS Atoms', value: FileTypes.CssAtoms},
            {name: 'Javascript', value: FileTypes.JavaScript},
          ]}
          value={this.state.codeType}
          design="small"
          onValueChange={(value: string) => {
            mixpanel.track(`modal-tab-code-type-change-${value}`);
            this.changeCodeType(value as FileTypes);
          }} />
        <div className="manual-deploy-code">
          <div className="manual-deploy-code-container">
            <pre className="manual-deploy-code-content">
              {this.state.code}
            </pre>
          </div>
        </div>
        <DTButton
          label="Copy"
          color={DTButtonColor.primary}
          style={{width: '100%', marginTop: '10px'}}
          icon={Icons.copy}
          onClick={async () => {
            mixpanel.track('download-copied-code', {
              codeType: this.state.codeType
            });
            await this.refreshCode();
            const area = document.createElement('textarea');
            document.body.appendChild(area);
            area.value = this.state.code;
            area.focus();
            area.select();
            const result = document.execCommand('copy');
            document.body.removeChild(area);
            if (!result) {
              throw new Error();
            }
            postMessagePromise(
              MessageRequest.notify,
              {message: 'Code copied to clipboard', error: false}
            );
          }}/>
      </div>
    );
  }
}
