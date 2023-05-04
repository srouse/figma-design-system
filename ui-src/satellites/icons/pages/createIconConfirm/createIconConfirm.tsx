import React from "react";
import {
  getIcon,
  Icons,
  MessageRequest,
  cleanName,
  CoreProps,
} from "../../../../../shared";
import DTButton, { DTButtonDesign } from "../../../../components/DTButton";
import Input from "../../../../components/input";
import postMessagePromise from "../../../../utils/postMessagePromise";
import "./createIconConfirm.css";

interface CreateIconConfirmProps extends CoreProps {
  onClose: () => void,
  icon: {
    svg: string,
    name: string,
    style: string,
  } | undefined
}

export default class CreateIconConfirm extends React.Component<CreateIconConfirmProps> {

  constructor(props: CreateIconConfirmProps | Readonly<CreateIconConfirmProps>) {
    super(props);

    // opportunity to clean up name...
    const finalName = props.icon && props.icon.name ? 
      cleanName( props.icon.name.replace('.svg', '') ) : 
      '';

    const propIcon = props.icon ? props.icon : {svg:'', name:'', style:''};

    this.state = {
      icon: {
        ...propIcon,
        name: finalName,
      }
    }
  }

  state: {
    icon: {
      svg: string,
      name: string,
      style: string,
    } | undefined
  }

  render() {
    if (!this.state.icon) {
      return <div>no icon</div>;
    }

    return (
      <div className="create-icon-confirm">
        <div className="create-icon-confirm-body">
          <div
            className="close"
            onClick={() => this.props.onClose()}
            dangerouslySetInnerHTML={{__html:getIcon(Icons.close)}}>
          </div>
          <div className="header">Confirm New Icon</div>
          <div
            className="icon-preview"
            dangerouslySetInnerHTML={{__html:this.state.icon.svg}}>
          </div>
          <Input
            label="Name"
            value={this.state.icon.name}
            onEnterOrBlur={(name: string) => {
              this.setState({icon:{...this.state.icon,name}});
            }} />
          {/* <Input
            label="Style"
            value={this.state.icon.style}
            onEnterOrBlur={(style: string) => {
              this.setState({icon:{...this.state.icon,style}});
            }} /> */}
          <div className="navigation">
            <DTButton
              label="Cancel"
              design={DTButtonDesign.border}
              onClick={() => {
                this.props.onClose();
              }} />
            <DTButton label="Create Icon" onClick={async () => {
              if (!this.state.icon) return;
              await postMessagePromise(
                MessageRequest.createIconFromSVG,
                {
                  icon: {
                    ...this.state.icon,
                    name: cleanName( this.state.icon.name )
                  },
                },
              );
              this.props.onClose();
            }} />
          </div>
        </div>
      </div>
    );
  }
}


