import React from "react";
import {
  CoreProps, getIcon, Icons, MessageRequest,
} from "../../../../../shared";
import { DSysSvgToken } from "../../../../../shared/types/designSystemTypes";
import { cleanAndSortTokensAlphabetical } 
  from "../../../../../shared/utils/cleanAndSortTokens";
import DetailModal from "../../../../components/DetailModal/DetailModal";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import postMessagePromise from "../../../../utils/postMessagePromise";
import IconsDetail from "../../details/iconsDetail";
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
      detailModalOpen: false,
    }
  }

  state: {
    isDeleting: boolean,
    newIconModalOpen: boolean,
    searchTerm: string,
    svgExample: string,
    focusedToken?: DSysSvgToken,
    detailModalOpen: boolean,
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
        icons-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeader
          title="Icon Tokens"
          onAdd={() =>{
            if (tokens.length >= 96) {
              postMessagePromise(
                MessageRequest.notify,
                {message: 'Only 96 icons allowed. Create another token set.', error: true}
              );
              return;
            }
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
            // const prop = tokenInfo[0];
            const iconToken = tokenInfo[1] as unknown as DSysSvgToken;
            return (
              <div
                className="dsys-row icons-list-row"
                key={`color-${iconToken.$extensions['dsys.componentSetId']}`}
                data-key={`color-${iconToken.$extensions['dsys.componentSetId']}`}
                onClick={() => {
                  this.setState({
                    detailModalOpen: true,
                    focusedToken: iconToken,
                  });
                }}>
                <div className="icons-list-row-icon"
                  dangerouslySetInnerHTML={{__html:iconToken.$value.svg}}>
                </div>
                <div className="icons-list-row-name">
                  {iconToken.$extensions["dsys.name"]}
                </div>
                {/* <div className="icons-list-line"></div>
                <div className="icons-list-row-style">
                  {iconToken.$value.style}
                </div>*/}
                <div className="dsys-row-deleting"
                    onClick={async() => {
                      if (tokens.length <= 1) {
                        postMessagePromise(
                          MessageRequest.notify,
                          {
                            message: 'You must have at least one icon in this set',
                            error: true
                          }
                        );
                        return;
                      }
                      if (this.state.isDeleting) {
                        await postMessagePromise(
                          MessageRequest.deleteIcon,
                          {
                            componentSetId: 
                              iconToken.$extensions['dsys.componentSetId']
                          }
                        );
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
        <DetailModal
          title={this.state.focusedToken?.$extensions["dsys.name"]}
          onClose={() => {
            this.setState({
              detailModalOpen: false
            })
          }}
          open={this.state.detailModalOpen}
          body={(
            <IconsDetail
              token={this.state.focusedToken}
              updateToken={(token : DSysSvgToken) => {
                console.log('token', token);
                /* updateEffect(
                  token,
                  this.props.refreshTokens
                );
                this.setState({
                  focusedToken: token,
                });*/
              }} />
          )} />
        {this.state.newIconModalOpen ? (
          <AddNewIcon 
            {...this.props}
            onClose={() => this.setState({newIconModalOpen:false})} />
        ) : null}
      </div>
    );
  }
}
