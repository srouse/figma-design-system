import React from "react";
import {
  getIcon,
  Icons
} from "../../../../../../../shared";
import { FREE_ICONS } from "../../../../utils/addFontAwesomeKit";
import findFontAwesomeKit, { FontAwesomeKit } from "../findFontAwesomeKit";
import "./fontAwesomeKitButton.css";
import FontAwesomeKitModal from "./fontAwesomeKitModal";

interface FontAwesomeKitButtonProps {
  fontAwesomeKit: string | undefined,
  fontAwesomeApiKey: string | undefined,
  updateFontAwesomeKit: (fontAwesomeKit: string) => Promise<string>
  updateFontAwesomeApiKey: (fontAwesomeApiKey: string) => Promise<string>
  onKitLoaded?: (kit: FontAwesomeKit | undefined) => void,
  style?: object,
}

export default class FontAwesomeKitButton
  extends React.Component<FontAwesomeKitButtonProps>
{

  constructor(
    props: FontAwesomeKitButtonProps | Readonly<FontAwesomeKitButtonProps>
  ) {
    super(props);
    this.state = {
      kitModalOpen: false,
      kit: undefined,
    };
    this.findKit();
  }

  state : {
    kitModalOpen: boolean,
    kit: FontAwesomeKit | undefined
  }

  async findKit() {
    this.setState({
      kit: undefined,
    });
    const kit = await findFontAwesomeKit(
      this.props.fontAwesomeApiKey,
      this.props.fontAwesomeKit,
      this.props.updateFontAwesomeKit
    );
    if (this.props.onKitLoaded) {
      this.props.onKitLoaded(kit);
    }
    this.setState({kit});
  }

  render() {
    let displayedToken = this.state.kit?.token || '-';
    if (displayedToken === FREE_ICONS) {
      displayedToken = '*********';
    }

    return (<>
      <div className="font-awesome-kit-button"
        style={this.props.style}
        onClick={() => this.setState({kitModalOpen: true})}>
        <div className="font-awesome-kit-button-fa-icon"
          dangerouslySetInnerHTML={{__html:getIcon(Icons.fontAwesome)}}>
        </div>
        <div className="font-awesome-kit-button-info">
          <div>
            Font Awesome Kit
          </div>
          <div>
            {this.state.kit?.name || 'loading...'}
          </div>
          <div>
            {displayedToken}
          </div>
        </div>
        <div className="font-awesome-kit-button-fa-icon"
          dangerouslySetInnerHTML={{__html:getIcon(Icons.edit)}}>
        </div>
      </div>
      {this.state.kitModalOpen ? (
          <FontAwesomeKitModal
            onClose={() => {
              this.setState({kitModalOpen: false});
              this.findKit();
            }}
            fontAwesomeApiKey={this.props.fontAwesomeApiKey}
            fontAwesomeKit={this.props.fontAwesomeKit}
            updateFontAwesomeKit={this.props.updateFontAwesomeKit}
            updateFontAwesomeApiKey={this.props.updateFontAwesomeApiKey} />
        ) : null}
    </>);
  }
}


