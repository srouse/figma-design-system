import React from "react";
import { getIcon, Icons } from "../../../shared";
import "./ListHeader.css";

interface ListHeaderProps {
  title: string,
  onDelete: () => void,
  onDeleteClose: () => void,
  onAdd: () => void,
}

export default class ListHeader extends React.Component<ListHeaderProps> {

  constructor(props: ListHeaderProps | Readonly<ListHeaderProps>) {
    super(props);
  }

  render() {
    return (
      <div className="list-header">
        {this.props.title}
        <div style={{flex: 1}}></div>
        <div
          className="list-header-btn delete"
          onClick={() => {
            if (this.props.onDelete) this.props.onDelete();
          }}
          dangerouslySetInnerHTML={{__html:getIcon(Icons.delete)}}>
        </div>
        <div
          className="list-header-btn plus"
          onClick={() =>{
            if (this.props.onDeleteClose) this.props.onDeleteClose();
            if (this.props.onAdd) this.props.onAdd();
          }} dangerouslySetInnerHTML={{__html:getIcon(Icons.plus)}}>
        </div>
      </div>
    );
  }
}