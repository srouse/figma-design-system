import React from "react";
import {
  CoreProps,
  getIcon,
  Icons,
  MessageRequest
} from "../../../../../shared";
import DTButton, {
  DTButtonDesign
} from "../../../../components/DTButton";
import postMessagePromise from "../../../../utils/postMessagePromise";
import CreateIconConfirm from "../createIconConfirm/createIconConfirm";
import "./addNewIcon.css";
import FontAwesomeIcon from "./fontAwesome/fontAwesomeIcon";

interface AddNewIconProps extends CoreProps {
  onClose: () => void,
}

export default class AddNewIcon extends React.Component<AddNewIconProps> {

  constructor(props: AddNewIconProps | Readonly<AddNewIconProps>) {
    super(props);
    this.state = {
      addType: undefined,
      iconConfirmOpen: false,
      icon: undefined,
    }
  }

  state: {
    addType: 'font-awesome' | 'upload-confirm' | undefined,
    iconConfirmOpen: boolean,
    icon: {
      svg: string,
      name: string,
      style: string,
    } | undefined,
  }

  render() {
    if (!this.state.addType) {
      return (<>
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
            <label className="upload-svg">
              Upload Icon
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
                          icon: {
                            svg: result,
                            name: file.name,
                            style: 'regular',
                          },
                          addType: 'upload-confirm'
                        });
                      }
                    );
                    reader.readAsText(file);
                  }
                }}
                accept="image/svg,.svg,image/svg+xml">
              </input>
            </label>
            <DTButton
              label="Icon From Selection"
              design={DTButtonDesign.border}
              onClick={async () => {
                const result = await postMessagePromise(
                  MessageRequest.createIconFromSelection
                ) as any;
                if (result && result.svg) {
                  this.setState({
                    icon: {
                      svg: result.svg.svg,
                      name: result.svg.name,
                      style: 'regular',
                    },
                    addType: 'upload-confirm'
                  });
                }
              }} />
            <DTButton
              label="Font Awesome"
              design={DTButtonDesign.border}
              onClick={() => this.setState({addType: 'font-awesome'})} />
          </div>
        </div>
      </>);
    }

    if (this.state.addType === 'font-awesome') {
      return <FontAwesomeIcon {...this.props} />
    }else if (this.state.addType === 'upload-confirm') {
      return <CreateIconConfirm
                {...this.props}
                onClose={this.props.onClose}
                icon={this.state.icon} />;
    }
  }
}


