import React from "react";
import "./Modal.css";

interface ModalProps {
  title?: string,
  open: boolean,
  onClose: () => void,
  body: JSX.Element | undefined
}

export default class Modal extends React.Component<ModalProps> {

  constructor(props: ModalProps | Readonly<ModalProps>) {
    super(props);
  }

  render() {
    return (
      <div className={`simple-modal-bg ${this.props.open ? 'open' : ''}`}>
        <div className="simple-modal-content">
          <div className="simple-modal-header">
            {this.props.title}
          </div>
          <div className="simple-modal-body">
            {this.props.body}
          </div>
        </div>
      </div>
    );
  }
}

