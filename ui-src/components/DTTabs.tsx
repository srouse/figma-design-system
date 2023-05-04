import React from "react";
import "./DTTabs.css";

interface DTTabsProps {
  tabs: {name:string, value: string}[],
  value: string,
  onValueChange?: (value: string) => void,
  className?: string,
  style?: object,
  design?: 'regular' | 'small' | undefined
}

export default class DTTabs extends React.Component<DTTabsProps> {

  constructor(props: DTTabsProps | Readonly<DTTabsProps>) {
    super(props);
  }

  onTabClick(tab: {name:string, value: string}) {
    if (this.props.onValueChange) {
      this.props.onValueChange(tab.value);
    }
  }

  render() {
    return (
      <div
        className={`
          ${this.props.className || ''}
          dttabs
          design-${this.props.design}`}
        style={this.props.style || {}}>
        {this.props.tabs.map(tab => {
          return (
            <div 
              className={`tab ${
                tab.value === this.props.value ? 'selected' : ''
              }`}
              onClick={() => this.onTabClick(tab)}>
              {tab.name}
            </div>
          );
        })}
      </div>
    );
  }
}