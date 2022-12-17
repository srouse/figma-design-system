import React from "react";
import {
  CoreProps, getIcon, Icons, MessageRequest,
} from "../../../../../shared";
import { DSysSvgToken } from "../../../../../shared/types/designSystemTypes";
import { cleanAndSortTokensAlphabetical } 
  from "../../../../../shared/utils/cleanAndSortTokens";
import DetailModal from "../../../../components/DetailModal/DetailModal";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import postMessagePromise from "../../../../utils/postMessagePromise";
import IconsDetail from "../../details/iconsDetail";
import AddNewIcon from "../addNewIcon/addNewIcon";
import "./iconsList.css";

export const MAX_ICONS = 63;

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
          title={`Icon Tokens (${tokens.length} of ${MAX_ICONS})`}
          onAdd={() =>{
            if (tokens.length >= MAX_ICONS) {
              postMessagePromise(
                MessageRequest.notify,
                {message:
                  `Only ${MAX_ICONS} icons allowed. 
                  Create another token set.`,
                  error: true
                }
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
          }}
          onDeleteClose={() => {
            this.setState({
              isDeleting: false
            });
          }} />
        <div className="dsys-list-body scroll-bar">
          {tokens.map(tokenInfo => {
            const prop = tokenInfo[0];
            const iconToken = tokenInfo[1] as unknown as DSysSvgToken;
            const componentId = iconToken.$extensions['dsys.componentId'];
            return (
              <div
                className="dsys-row icons-list-row"
                key={`color-${componentId}`}
                data-key={`color-${componentId}`}
                onClick={() => {
                  this.setState({
                    detailModalOpen: true,
                    focusedToken: iconToken,
                  });
                }}>
                <div
                  className="icons-list-row-icon"
                  dangerouslySetInnerHTML={{__html:iconToken.$value.svg}}>
                </div>
                <div className="icons-list-row-name">
                  {prop}
                </div>
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
                            componentId
                          }
                        );
                        this.setState({
                          isDeleting: false
                        });
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
            onClose={async () => {
              await postMessagePromise(
                MessageRequest.refreshIconTokens,
              );
              this.setState({
                detailModalOpen: false,
                focusedToken: undefined,
              })
            }}
            open={this.state.detailModalOpen}
            body={
              this.state.focusedToken ? (
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
                ) : <div></div>
            } />
        {this.state.newIconModalOpen ? (
          <AddNewIcon 
            {...this.props}
            onClose={() => this.setState({newIconModalOpen:false})} />
        ) : null}
      </div>
    );
  }
}
