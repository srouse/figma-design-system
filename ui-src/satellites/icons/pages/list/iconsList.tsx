import React from "react";
import {
  CoreProps,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import "./iconsList.css";

export default class IconsList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      fontAwesomeModalOpen: false,
      searchTerm: '',
    }
  }

  state: {
    fontAwesomeModalOpen: boolean,
    searchTerm: string,
  }

  async getFonts() {
    
  }

  render() {
    return (
      <div className="icons-list">
        <DTButton
          label="Add Icon"
          color={DTButtonColor.primary}
          onClick={() => {
            this.setState({
              fontAwesomeModalOpen: true,
            });
            this.getFonts();
          }}></DTButton>
        {this.state.fontAwesomeModalOpen ? (
          <div className="font-awesome-modal">
            <div className="font-awesome-modal-body">
              <div onClick={() => {
                this.setState({
                  fontAwesomeModalOpen: false,
                  searchTerm:'',// reset
                });
              }}>close</div>
              <Input
                label="" 
                value={this.state.searchTerm}
                placeholder="search"
                onEnterOrBlur={async (searchTerm: string) => {
                  this.setState({searchTerm});
                }} />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
