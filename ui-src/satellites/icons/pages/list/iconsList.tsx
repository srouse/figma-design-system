import React from "react";
import {
  CoreProps, getIcon, Icons,
} from "../../../../../shared";
import { DSysSvgToken } from "../../../../../shared/types/designSystemTypes";
import { cleanAndSortTokensAlphabetical } from "../../../../../shared/utils/cleanAndSortTokens";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import "./iconsList.css";

export default class IconsList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      fontAwesomeModalOpen: false,
      searchTerm: '',
      svgExample: '',
    }

    // document.addEventListener('change', this.onChangeHandler);
  }

  state: {
    isDeleting: boolean,
    fontAwesomeModalOpen: boolean,
    searchTerm: string,
    svgExample: string,
  }

  onChangeHandler(evt: Event) {
    console.log(evt);
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
    console.log('tokenset', tokenset);

    return (
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        {/* <DTButton
          label="Add Icon"
          color={DTButtonColor.primary}
          onClick={() => {
            this.setState({
              fontAwesomeModalOpen: true,
            });
          }}></DTButton> */}
        <ListHeader
          title="Icon Tokens"
          onAdd={() =>{
            this.setState({
              fontAwesomeModalOpen: true,
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
              <input type="file"
                id="uploadSvg" name="uploadSvg"
                onChange={(evt) => {
                  const fileList = evt.target.files;
                  console.log(fileList);
                  if (fileList && fileList.length > 0) {
                    const file = fileList[0];
                    if (file.type && !file.type.startsWith('image/')) {
                      console.log('File is not an image.', file.type, file);
                      return;
                    }
                    const reader = new FileReader();
                    reader.addEventListener('load', (event: ProgressEvent) => {
                      const result = (event.target as FileReader).result;
                      this.setState({
                        svgExample: result,
                      })
                    });
                    reader.readAsText(file);
                  }
                }}
                accept="image/svg,.svg,image/svg+xml"></input>
              <div dangerouslySetInnerHTML={{__html:this.state.svgExample}}></div>
              upload svg, import local vector, or import from font awesome
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
