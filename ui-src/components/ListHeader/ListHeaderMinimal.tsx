import React from "react";
import "./ListHeader.css";

interface ListHeaderMinimalProps {
  title: string,
}

export default class ListHeaderMinimal extends React.Component<ListHeaderMinimalProps> {

  constructor(props: ListHeaderMinimalProps | Readonly<ListHeaderMinimalProps>) {
    super(props);
  }

  render() {
    return (
      <div className="list-header">
        {this.props.title}
        <div style={{flex: 1}}></div>
      </div>
    );
  }
}