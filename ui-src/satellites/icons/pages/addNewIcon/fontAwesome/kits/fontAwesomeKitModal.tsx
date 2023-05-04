import React from "react";
import { getIcon, Icons } from "../../../../../../../shared";
import DTButton, { DTButtonDesign } from "../../../../../../components/DTButton";
import Input from "../../../../../../components/Input";
import Select from "../../../../../../components/Select";
import { FREE_ICONS } from "../../../../utils/addFontAwesomeKit";
import { findAuthKey, findKits, FontAwesomeKit } from "../findFontAwesomeKit";
import "./fontAwesomeKitModal.css";
import * as mixpanel from '../../../../../../utils/mixpanel';

interface FontAwesomeKitModalProps {
  onClose: () => void,
  fontAwesomeKit: string | undefined,
  fontAwesomeApiKey: string | undefined,
  updateFontAwesomeKit: (fontAwesomeKit: string) => Promise<string>
  updateFontAwesomeApiKey: (fontAwesomeApiKey: string) => Promise<string>
}

export default class FontAwesomeKitModal
  extends React.Component<FontAwesomeKitModalProps>
{

  constructor(
    props: FontAwesomeKitModalProps | Readonly<FontAwesomeKitModalProps>
  ) {
    super(props);
    this.state = {
      fontAwesomeApiKey: props.fontAwesomeApiKey,
      fontAwesomeKit: props.fontAwesomeKit,
      kits: [],
      kitSelector: [],
      loadingKits: false,
      error: undefined,
      loading: false,
    }
    setTimeout(() => this.loadKits(), 0 );
  }

  state: {
    fontAwesomeApiKey: string | undefined,
    fontAwesomeKit: string | undefined,
    kits: FontAwesomeKit[],
    kitSelector: {value: string, name: string}[],
    loadingKits: boolean,
    loading: boolean, // loading overall...
    error: string | undefined,
  };
  
  setError( error: string) {
    this.setState({
      error,
      loadingKits: false,
    });
  }

  async loadKits() {
    if (!this.state.fontAwesomeApiKey) return;
    this.setState({
      loadingKits: true
    });
    const authKey = await findAuthKey(this.state.fontAwesomeApiKey);
    if (!authKey) {
      this.setError('API Key failed. Check your key.');
      return;
    }
    const kits = await findKits(authKey);
    if (kits.length === 0) {
      this.setError('No kits found for that account');
      return;
    }
    const kitSelector: {value: string, name: string}[] = [
      {value:'', name: 'Choose Kit'},
    ];
    let fontAwesomeKitFound = false;
    kits.map((kit) => {
      if (kit.token === this.state.fontAwesomeKit) {
        fontAwesomeKitFound = true;
      }
      kitSelector.push({
        name: `${kit.name} (${kit.licenseSelected}) ${kit.version}`,
        value: kit.token
      });
    });
    this.setState({
      kits,
      kitSelector,
      loadingKits: false,
      fontAwesomeKit: fontAwesomeKitFound ? this.state.fontAwesomeKit : '',
    });
  }

  render() {
    return (
      <div className="font-awesome-kit-modal">
        <div className="font-awesome-kit-modal-body">
          <div
            className="close"
            onClick={() => this.props.onClose()}
            dangerouslySetInnerHTML={{__html:getIcon(Icons.close)}}>
          </div>
          <h1>Font Awesome Kits</h1>
          <h2>Pro Fonts</h2>
          <Input
            label="Font Awesome API Key"
            placeholder="Input your key and we'll find your kits"
            type="password"
            value={this.state.fontAwesomeApiKey}
            onEnterOrBlur={async (fontAwesomeApiKey: string) => {
              if (this.state.fontAwesomeApiKey === fontAwesomeApiKey) return;
              this.setState({fontAwesomeApiKey, error: ''});
              setTimeout(() => this.loadKits(), 0 );
            }} />

          {this.state.loadingKits ? (
            <div className="loading-kits">loading kits...</div>
          ) : null}

          {this.state.kitSelector.length > 1 ? 
            (<>
              <Select
                label="Kits ( v6+ required )"
                value={this.state.fontAwesomeKit}
                dropdown={
                  this.state.kitSelector
                }
                onChange={(value) => {
                  this.setState({
                    fontAwesomeKit: value,
                    error: '',
                  });
              }} />
              <DTButton
                label="Use This Kit"
                design={DTButtonDesign.border}
                onClick={() => {
                  (async () => {
                    if (
                      !this.state.fontAwesomeApiKey ||
                      !this.state.fontAwesomeKit
                    ) {
                      this.setError('API Key empty or Kit not selected');
                      return;
                    };

                    const kit = this.state.kits.find(kit => 
                      kit.token === this.state.fontAwesomeKit
                    );
                    if (!kit || kit.version.indexOf('6.') !== 0) {
                      this.setError('Need a kit with version 6.');
                      return;
                    }

                    this.setState({loading: true});
                    await this.props.updateFontAwesomeApiKey(
                      this.state.fontAwesomeApiKey
                    );
                    await this.props.updateFontAwesomeKit(
                      this.state.fontAwesomeKit
                    );
                    this.setState({loading: false});
                    this.props.onClose();
                    mixpanel.track(`fontAwesomeApiKit`);
                  })();
                }} />
              </>) : null}

          {this.state.error ? (
            <div className="error">
              {this.state.error}
            </div>
          ) : null}

          <h2>Free Fonts</h2>
          <DTButton
            label="Use Free Fonts"
            design={DTButtonDesign.border}
            onClick={() => {
              (async () => {
                this.setState({loading: true});
                await this.props.updateFontAwesomeApiKey(
                  this.state.fontAwesomeApiKey || ''
                );
                await this.props.updateFontAwesomeKit(FREE_ICONS);
                this.setState({loading: false});
                this.props.onClose();
                mixpanel.track(`fontAwesomeFreeKit`);
              })();
            }} />

          {this.state.loading ? (
            <div className="loading">saving...</div>
          ) : null}

        </div>
      </div>
    );
  }
}


