import React from "react";
import {
  CoreProps,
  getIcon,
  Icons,
  MessageRequest
} from "../../../../../shared";
import DTButton, { DTButtonDesign } from "../../../../components/DTButton";
import Input from "../../../../components/input";
import postMessagePromise from "../../../../utils/postMessagePromise";
import "./uploadIcon.css";

interface UploadIconProps extends CoreProps {
  onClose: () => void,
}

export default class UploadIcon extends React.Component<UploadIconProps> {

  constructor(props: UploadIconProps | Readonly<UploadIconProps>) {
    super(props);
    this.state = {
      svgExample: 'Icon Preview',
      svgName: undefined,
      style: 'regular',
    }
  }

  state: {
    svgExample: string,
    svgName?: string,
    style? : string,
  }

  render() {
    return (
      <div className="upload-new-icon">
        <div className="upload-new-icon-body">
          <div
            className="close"
            onClick={() => this.props.onClose()}
            dangerouslySetInnerHTML={{__html:getIcon(Icons.close)}}>
          </div>
          <div className="header">Upload New Icon</div>
          <div
            className="icon-preview"
            dangerouslySetInnerHTML={{__html:this.state.svgExample}}>
          </div>
          {this.state.svgName ? (<>
            <Input
              label="Icon Name"
              value={this.state.svgName}
              onEnterOrBlur={(newName: string) => {
                this.setState({
                  svgName: newName,
                })
              }} />
            <Input
              label="Style"
              value={this.state.style}
              onEnterOrBlur={(style: string) => {
                this.setState({style})
              }} />
            <div className="navigation">
              <DTButton
                label="Cancel"
                design={DTButtonDesign.border}
                onClick={() => {
                  this.setState({
                    svgExample: 'Icon Preview',
                    svgName: undefined,
                  })
                }} />
              <DTButton label="Create Icon" onClick={async () => {
                postMessagePromise(
                  MessageRequest.createIconFromSVG,
                  {
                    icon: {
                      svg: this.state.svgExample,
                      name: this.state.svgName,
                      style: this.state.style
                    }
                  },
                );
                this.props.onClose();
              }} />
            </div>
            </>) : (
              <label className="upload-svg">
                Select SVG
                <input
                  type="file"
                  onChange={(evt) => {
                    const fileList = evt.target.files;
                    if (fileList && fileList.length > 0) {
                      const file = fileList[0];
                      if (file.type && !file.type.startsWith('image/')) {
                        console.error('File is not an image.', file.type, file);
                        return;
                      }
                      const reader = new FileReader();
                      reader.addEventListener('load',
                        async (event: ProgressEvent) => {
                          const result = (event.target as FileReader).result;
                          this.setState({
                            svgExample: result,
                            svgName: file.name,
                          });
                        }
                      );
                      reader.readAsText(file);
                    }
                  }}
                  accept="image/svg,.svg,image/svg+xml">
                </input>
              </label>
            )}
        </div>
      </div>
    );
  }
}


