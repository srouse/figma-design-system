import React from "react";
import "./HelpLink.css";
import { Icons, colors, getIcon } from "../../shared";

interface HelpLinkProps {
  style?: object,
  content: string,
  link: string,
  invert?: boolean,
}

export default class HelpLink extends React.Component<HelpLinkProps> {

  constructor(props: HelpLinkProps | Readonly<HelpLinkProps>) {
    super(props);
  }

  render() {
    const iconSvg = getIcon(
      Icons.help,
      this.props.invert === true ? colors.white : colors.primary
    );
    return (
      <a
        className={`help-link ${this.props.invert === true ? 'invert': ''}`}
        style={this.props.style}
        href={this.props.link} target="_new">
        <div className="icon"
          dangerouslySetInnerHTML={{__html: iconSvg}}></div>
        {this.props.content}
      </a>
    );
  }
}

