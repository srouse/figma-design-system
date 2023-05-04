import React from "react";

export default class UpdateVersionInstructions extends React.Component {
  render() { 
    return (
      <div>
        To update all widgets:
        <ol style={{paddingLeft: '17px'}}>
          <li style={{marginBottom: '8px'}}>
            right click one of the widgets and click
            "Widgets" &gt; "Update to latest version".
          </li>
          <li>
            Hit the refresh icon on the widget you updated. This will 
            update all the widgets to use the latest version.
          </li>
        </ol> 
      </div>
    );
  }
}