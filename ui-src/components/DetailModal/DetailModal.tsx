import React from "react";
import { getIcon, Icons } from "../../../shared";
import "./DetailModal.css";

interface DetailModalProps {
  title?: string,
  open: boolean,
  onClose: () => void,
  body: JSX.Element
}

export default class DetailModal extends React.Component<DetailModalProps> {

  constructor(props: DetailModalProps | Readonly<DetailModalProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`detail-modal ${this.props.open ? 'open' : ''}`}>
        <div className="detail-modal-header">
          <div
            className="detail-modal-close-btn"
            onClick={this.props.onClose}
            dangerouslySetInnerHTML={{__html:getIcon(Icons.chevronLeft)}}>
          </div>
          <div
            className="detail-modal-title"
            onClick={this.props.onClose}>
            {this.props.title}
          </div>
        </div>
        <div className="detail-modal-body">
          {this.props.body}
        </div>
      </div>
    );
  }
}

