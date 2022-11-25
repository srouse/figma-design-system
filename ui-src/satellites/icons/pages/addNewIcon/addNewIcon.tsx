import React from "react";
import {
  CoreProps,
  getIcon,
  Icons
} from "../../../../../shared";
import DTButton, {
  DTButtonDesign
} from "../../../../components/DTButton";
import "./addNewIcon.css";
import FontAwesomeIcon from "./fontAwesomeIcon";
import UploadIcon from "./uploadIcon";

interface AddNewIconProps extends CoreProps {
  onClose: () => void,
}

export default class AddNewIcon extends React.Component<AddNewIconProps> {

  constructor(props: AddNewIconProps | Readonly<AddNewIconProps>) {
    super(props);
    this.state = {
      addType: undefined,
      searchTerm: '',
      svgExample: '',
    }
  }

  state: {
    addType: 'font-awesome' | 'upload' | undefined,
    searchTerm: string,
    svgExample: string,
  }

  render() {
    if (!this.state.addType) {
      return (
        <div
          className="add-new-icon"
          onClick={() => this.props.onClose()}>
          <div className="add-new-icon-body choose-type"
            onClick={(evt) => evt.stopPropagation()}>
            <div
              className="close"
              onClick={() => this.props.onClose()}
              dangerouslySetInnerHTML={{__html:getIcon(Icons.close)}}>
            </div>
            <div className="header">Create New Icon</div>
            <DTButton
              label="Upload Icon"
              design={DTButtonDesign.border}
              onClick={() => this.setState({addType: 'upload'})} />
            <DTButton
              label="Font Awesome"
              design={DTButtonDesign.border}
              onClick={() => this.setState({addType: 'font-awesome'})} />
            <div className="other-option">
              You can also add a new icon by selecting your icon 
              and hitting the "+" button on the widget.
            </div>
          </div>
        </div>
      );
    }

    if (this.state.addType === 'upload') {
      return <UploadIcon {...this.props} />
    } else {
      return <FontAwesomeIcon {...this.props} />
    }
  }
}


