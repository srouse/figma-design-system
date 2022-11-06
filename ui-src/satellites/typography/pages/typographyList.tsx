import React from "react";
import {
  cleanAndSortTokens,
  colors,
  CoreProps,
  getIcon,
  Icons,
  MessageRequest
} from "../../../../shared";
import { 
  DSysTypographyToken
} from "../../../../shared/types/designSystemTypes";
import Input from "../../../components/Input";
import ListHeader from "../../../components/ListHeader/ListHeader";
import DragAndDropList from "../../../components/DragAndDropList/dragAndDropList";
import { addTypographyToken, changeName, changeOrder, deleteTypographyToken, updateTypographyToken } from "./typographyActions";
import './typographyRow.css';
import postMessagePromise from "../../../utils/postMessagePromise";
import DetailModal from "../../../components/DetailModal/DetailModal";
import TypographyDetail from "./TypographyDetail/TypographyDetail";
import typeIframeContent from "./utils/TypeIframeContent";


export type FontWithStyles = {family: string, styles: string[]};
export type FigmaFontLookup = {[key:string]:{family: string, style: string}};

export default class TypographyList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      detailModalOpen: false,
      fonts: [],
      fontLookup: {}
    }

    postMessagePromise(
      MessageRequest.getAvailableFonts
    ).then((results : any) => {
      const finalFonts: FontWithStyles[] = [];
      const fontLookup: {[key:string]: FontWithStyles} = {};
      (results.fonts as FigmaFontLookup[]).map((font) => {
        if (!fontLookup[font.fontName.family]) {
          fontLookup[font.fontName.family] = {
            family: font.fontName.family,
            styles: [font.fontName.style]
          };
          finalFonts.push(fontLookup[font.fontName.family]);
        }else{
          fontLookup[font.fontName.family].styles.push(font.fontName.style);
        }
      });
      this.setState({
        fonts: finalFonts,
        fontLookup
      })
    });
  }

  state : {
    isDeleting: boolean,
    detailModalOpen: boolean,
    focusedToken?: DSysTypographyToken,
    fonts: FontWithStyles[],
    fontLookup: FigmaFontLookup,
  }

  render() {
    if (!this.props.tokenGroup) return (<div>No Steps Found</div>);
    const tokenset = this.props.tokenGroup.tokensets[0];
    if (!tokenset) return (<div>No Steps Found</div>);
    const tokens = cleanAndSortTokens(tokenset);

    return (<>
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeader 
          title="Typography Tokens"
          onAdd={() =>{
            addTypographyToken(
              this.props.tokenGroup,
              this.props.refreshTokens,
            ).then(result => {
              if (result.success === false) {
                postMessagePromise(
                  MessageRequest.notify,
                  {message: result.message, error: true}
                );
              }
            });
          }}
          onDelete={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
          }} />
        <div className="dsys-list-body scroll-bar">
          <DragAndDropList
            rowHeight={48}
            onChange={(
              rowIndex: number,
              dropIndex: number
            ) => {
              changeOrder(
                rowIndex, dropIndex,
                this.props.tokenGroup,
                this.props.refreshTokens,
              );
            }}
            rowList={tokens}
            rowGenerator={(
              tokenInfo, index,
              onMouseDownCapture,
              onMouseUpCapture,
            ) => {
              const prop = tokenInfo[0];
              const token = tokenInfo[1] as DSysTypographyToken;
              return (
                <div
                  className="dsys-row"
                  key={`type-${token.$extensions['dsys.styleId']}`}
                  data-key={`type-${token.$extensions['dsys.styleId']}`}>
                  <div className="dsys-row-dragger"
                    dangerouslySetInnerHTML={{ __html: 
                      getIcon(Icons.drag, colors.greyLight) 
                    }}
                    onMouseDown={onMouseDownCapture}
                    onMouseUp={onMouseUpCapture}>
                  </div>
                  <div className="dsys-row-name">
                    <Input
                      hideLabel hideBorder
                      label="property"
                      value={prop}
                      onEnterOrBlur={(newName: string) => {
                        changeName(
                          newName, prop,
                          this.props.tokenGroup,
                          this.props.refreshTokens
                        );
                      }} />
                  </div>
                  <div className="typography-row-size">
                    <Input
                      hideLabel hideBorder
                      label="property"
                      textAlign="right"
                      type="number"
                      selectAllOnFocus={true}
                      value={`${token.$value.fontSize}`}
                      onArrowUpOrDown={(
                        value: string,
                        increment: number,
                      ) => {
                        const newToken = {
                          ...token,
                          $value: {
                            ...token.$value,
                            fontSize: parseFloat(value) + increment,
                          }
                        }
                        updateTypographyToken(
                          newToken,
                          this.props.refreshTokens
                        );
                        this.setState({
                          focusedToken: newToken,
                        }); 
                      }}
                      onEnterOrBlur={(newSize: string) => {
                        const newToken = {
                          ...token,
                          $value: {
                            ...token.$value,
                            fontSize: parseFloat(newSize),
                          }
                        }
                        updateTypographyToken(
                          newToken,
                          this.props.refreshTokens
                        );
                        this.setState({
                          focusedToken: newToken,
                        });
                      }} />
                  </div>
                  <div className="typography-iframe-box"
                    onClick={() => {
                      this.setState({
                        detailModalOpen: true,
                        focusedToken: token,
                      });
                    }}>
                    <iframe
                      className="typography-iframe-example"
                      tabIndex={-1}
                      srcDoc={typeIframeContent(
                        token
                      )}>
                    </iframe>
                  </div>
                  
                  <div className="typography-row-details"
                    onClick={() => {
                      this.setState({
                        detailModalOpen: true,
                        focusedToken: token,
                      });
                    }}>
                    <div>
                      {token.$value.figmaFontObj.family} {
                      token.$value.figmaFontObj.style}
                    </div>
                    <div>
                      {token.$value.fontSize}px / {token.$value.lineHeight.unit}
                    </div>
                  </div>
                  <div className="dsys-row-deleting"
                    tabIndex={this.state.isDeleting ? 0 : -1}
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteTypographyToken(
                          token as DSysTypographyToken,
                          this.props.refreshTokens
                        );
                        setTimeout(() => {// need to wait a beat for refresh
                          this.setState({
                            isDeleting: false,
                          });
                        }, 300);
                      }
                    }}>
                    <div className="dsys-row-deleting-icon"
                      dangerouslySetInnerHTML={{ __html: 
                        getIcon(Icons.delete) 
                      }}></div>
                  </div>
                </div>
              );
            }}>
          </DragAndDropList>
        </div>
      </div>
      <DetailModal
        title={this.state.focusedToken?.$extensions["dsys.name"]}
        onClose={() => {
          this.setState({
            detailModalOpen: false
          })
        }}
        open={this.state.detailModalOpen}
        body={this.state.focusedToken ? (
          <TypographyDetail
            token={this.state.focusedToken}
            fonts={this.state.fonts}
            updateToken={(token : DSysTypographyToken) => {
              updateTypographyToken(
                token,
                this.props.refreshTokens
              );
              this.setState({
                focusedToken: token,
              });
            }} />
        ): (<div></div>)} />
    </>);
  }

}
