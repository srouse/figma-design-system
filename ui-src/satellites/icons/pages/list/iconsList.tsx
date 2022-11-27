import React from "react";
import {
  CoreProps, getIcon, Icons,
} from "../../../../../shared";
import { DSysSvgToken } from "../../../../../shared/types/designSystemTypes";
import { cleanAndSortTokensAlphabetical } 
  from "../../../../../shared/utils/cleanAndSortTokens";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import AddNewIcon from "../addNewIcon/addNewIcon";
import "./iconsList.css";

export default class IconsList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      newIconModalOpen: false,
      searchTerm: '',
      svgExample: '',
    }
  }

  state: {
    isDeleting: boolean,
    newIconModalOpen: boolean,
    searchTerm: string,
    svgExample: string,
  }

  render() {
    if (
      !this.props.tokenGroup ||
      !this.props.tokenGroup.tokensets[0]
    ) return (
      <div className="color-list-no-tokenset">
        <div className="color-list-no-tokenset-text">no tokenset</div>
      </div>
    );

    const tokenset = this.props.tokenGroup.tokensets[0];
    const tokens = cleanAndSortTokensAlphabetical(tokenset);

    return (
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeader
          title="Icon Tokens"
          onAdd={() =>{
            this.setState({
              newIconModalOpen: true,
            });
          }}
          onDelete={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
          }} />
        <div className="dsys-list-body scroll-bar">
          {tokens.map(tokenInfo => {
            const prop = tokenInfo[0];
            const iconToken = tokenInfo[1] as unknown as DSysSvgToken;
            return (
              <div
                className="dsys-row icons-list-row"
                key={`color-${iconToken.$extensions['dsys.componentSetId']}`}
                data-key={`color-${iconToken.$extensions['dsys.componentSetId']}`}>
                <div className="icons-list-row-icon"
                  dangerouslySetInnerHTML={{__html:iconToken.$value.svg}}>
                </div>
                <div className="icons-list-row-name">
                  {iconToken.$extensions["dsys.name"]}
                </div>
                <div className="icons-list-line"></div>
                <div className="icons-list-row-style">
                  {iconToken.$value.style}
                </div>
                <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        /*if (!this.props.tokenGroup) return;
                        deleteColorToken(
                          colorToken,
                          this.props.refreshTokens
                        );
                        setTimeout(() => {// need to wait a beat for refresh
                          this.setState({
                            isDeleting: false,
                          });
                        }, 300);*/
                      }
                    }}>
                    <div className="dsys-row-deleting-icon"
                      dangerouslySetInnerHTML={{ __html: 
                        getIcon(Icons.delete) 
                      }}></div>
                  </div>
              </div>
            );
          })}
        </div>
        {this.state.newIconModalOpen ? (
          <AddNewIcon 
            {...this.props}
            onClose={() => this.setState({newIconModalOpen:false})} />
        ) : null}
      </div>
    );
  }
}
