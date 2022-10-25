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
import { addTypographyToken, changeName, changeOrder, deleteTypographyToken } from "./typographyActions";
import "../../../components/DragAndDropList/dsysList.css";
import "../../../components/DragAndDropList/dsysRow.css";
import './typographyRow.css';
import postMessagePromise from "../../../utils/postMessagePromise";
import loadGoogleFont from "../../../utils/loadGoogleFont";
import DetailModal from "../../../components/DetailModal/DetailModal";
import TypographyDetail from "./TypographyDetail/TypographyDetail";


export type FontWithStyles = {family: string, styles: string[]};
type FigmaFont = {fontName:{family: string, style: string}};

export default class TypographyList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      detailModealOpen: false,
      fonts: [],
    }

    postMessagePromise(
      MessageRequest.getAvailableFonts
    ).then((results : any) => {
      const finalFonts: FontWithStyles[] = [];
      const fontLookup: {[key:string]: FontWithStyles} = {};
      (results.fonts as FigmaFont[]).map((font) => {
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
        fonts: finalFonts
      })
    });
  }

  state : {
    isDeleting: boolean,
    detailModealOpen: boolean,
    focusedToken?: DSysTypographyToken,
    fonts: FontWithStyles[],
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
              token, index,
              onMouseDownCapture,
              onMouseUpCapture,
            ) => {
              const prop = token[0];
              const value = token[1] as DSysTypographyToken;
              // const color = value.$value as DTShad;
              loadGoogleFont(value.$value.fontFamily);

              return (
                <div
                  className="dsys-row"
                  key={`color-${value.$extensions['dsys.styleId'] || index}}`}>
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
                  <div className="typography-row-example"
                    style={{
                      fontFamily      : value.$value.fontFamily,
                      fontWeight      : value.$value.fontWeight,
                      fontSize        : Math.min( 36, value.$value.fontSize ),
                      textTransform   : value.$value.textCase === 'upper' ? 
                        'uppercase' : 
                        value.$value.textCase === 'lower' ?
                        'lowercase' : 
                        value.$value.textCase === 'title' ?
                        'capitalize' : 'none',
                      textDecoration  : value.$value.textDecoration
                    }}
                    onClick={() => {
                      this.setState({
                        detailModealOpen: true,
                        focusedToken: value
                      });
                    }}>
                    Ag
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteTypographyToken(
                          value as DSysTypographyToken,
                          this.props.refreshTokens
                        );
                        setInterval(() => {// need to wait a beat for refresh
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
            detailModealOpen: false
          })
        }}
        open={this.state.detailModealOpen}
        body={(
          <TypographyDetail
            token={this.state.focusedToken}
            fonts={this.state.fonts} />
        )} />
    </>);
  }

}
