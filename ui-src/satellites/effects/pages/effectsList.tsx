import React from "react";
import { cleanAndSortTokens, colors, CoreProps, DSysShadowToken, getIcon, Icons, MessageRequest } from "../../../../shared";
import { DSysBlurToken } from "../../../../shared/types/designSystemTypes";
import Input from "../../../components/Input";
import ListHeader from "../../../components/ListHeader/ListHeader";
import DragAndDropList from "../../../components/DragAndDropList/dragAndDropList";
import { addEffectToken, changeName, changeOrder, deleteEffectToken } from "./effectActions";
import "../../../components/DragAndDropList/dsysList.css";
import "../../../components/DragAndDropList/dsysRow.css";
import postMessagePromise from "../../../utils/postMessagePromise";

export default class EffectsList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
    }
  }

  state : {
    isDeleting: boolean,
  }

  render() {
    if (!this.props.tokenGroup) return (<div>No Steps Found</div>);
    const tokenset = this.props.tokenGroup.tokensets[0];
    if (!tokenset) return (<div>No Steps Found</div>);
    const tokens = cleanAndSortTokens(tokenset);

    return (
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeader 
          title="Effect Tokens"
          onAdd={() =>{
            addEffectToken(
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
              const value = token[1] as DSysShadowToken | DSysBlurToken;
              // const color = value.$value as DTShad;
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
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteEffectToken(
                          value as DSysShadowToken,// either works
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
    );
  }

}