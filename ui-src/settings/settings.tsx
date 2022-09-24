import React from "react";
import "./settings.css";

interface SettingsProps {
  test?: string,
  style?: object
}

export default class Settings extends React.Component<SettingsProps> {

  constructor(props: SettingsProps | Readonly<SettingsProps>) {
    super(props);
  }

  render() { 
    return (
      <div
        className="settings"
        style={this.props.style || {}}>
        settings
      </div>
    );
  }
}