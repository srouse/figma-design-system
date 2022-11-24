import React from "react";
import { CoreProps, getIcon, Icons, MessageRequest } from "../../../../../shared";
import DTButton, { DTButtonDesign } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import postMessagePromise from "../../../../utils/postMessagePromise";
import "./addNewIcon.css";

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

    return (
      <div className="add-new-icon">
        <div className="add-new-icon-body">
          <div onClick={() => {
            this.setState({
              searchTerm:'',// reset
            });
            this.props.onClose();
          }}>close</div>
          <Input
            label="" 
            value={this.state.searchTerm}
            placeholder="search"
            onEnterOrBlur={async (searchTerm: string) => {
              this.setState({searchTerm});
            }} />
          <input type="file"
            id="uploadSvg" name="uploadSvg"
            onChange={(evt) => {
              const fileList = evt.target.files;
              console.log(fileList);
              if (fileList && fileList.length > 0) {
                const file = fileList[0];
                if (file.type && !file.type.startsWith('image/')) {
                  console.log('File is not an image.', file.type, file);
                  return;
                }
                const reader = new FileReader();
                reader.addEventListener('load',
                  async (event: ProgressEvent) => {
                    const result = (event.target as FileReader).result;
                    this.setState({
                      svgExample: result,
                    });
                    await postMessagePromise(
                      MessageRequest.createIconFromSVG,
                      {svg: result, fileName: file.name},
                    );
                  }
                );
                reader.readAsText(file);
              }
            }}
            accept="image/svg,.svg,image/svg+xml"></input>
          <div dangerouslySetInnerHTML={{__html:this.state.svgExample}}></div>
          upload svg, import local vector, or import from font awesome
        </div>
      </div>
    );
  }
}


