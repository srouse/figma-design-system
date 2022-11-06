import React from "react";
import {
  cleanAndSortTokens,
  colors,
  CoreProps,
  DSysShadowToken,
  DTTokenType,
  getIcon,
  Icons,
  hexAlphaToCss,
  MessageRequest
} from "../../../../../shared";
import { DSysBlurToken } from "../../../../../shared/types/designSystemTypes";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import DragAndDropList from "../../../../components/DragAndDropList/dragAndDropList";
import {
  addBlurEffectToken,
  addShadowEffectToken,
  changeName,
  changeOrder,
  deleteEffectToken,
  updateEffect
} from "../effectActions";
import EffectsDetail from "../EffectsDetail/EffectsDetail";
import DetailModal from "../../../../components/DetailModal/DetailModal";
import "./effectsRow.css";
import "./effectsList.css";
import postMessagePromise from "../../../../utils/postMessagePromise";

export default class EffectsList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      detailModalOpen: false,
    };
  }

  state : {
    isDeleting: boolean,
    focusedToken?: DSysShadowToken | DSysBlurToken,
    detailModalOpen: boolean,
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
          title="Effect Tokens"
          onAdd={() =>{
            this.props.createPrompt(
              'What Type of Effect?',
              <div className="effects-new-prompt">
                <div className="effects-new-button"
                  onClick={() => {
                    addShadowEffectToken(
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
                    this.props.closePrompt();
                  }}>
                  Shadow Effect
                </div>
                <div className="effects-new-button"
                  onClick={() => {
                    addBlurEffectToken(
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
                    this.props.closePrompt();
                  }}>
                  Blur Effect
                </div>
              </div>
            );
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
              const isShadow = value.$type === DTTokenType.shadow;

              return (
                <div
                  className="dsys-row effect-row"
                  key={`effect-${value.$extensions['dsys.styleId']}`}
                  data-key={`effect-${value.$extensions['dsys.styleId']}`}>
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
                  <div
                    className="effect-row-box"
                    onClick={() => {
                      this.setState({
                        detailModalOpen: true,
                        focusedToken: value,
                      });
                    }}>
                      {isShadow ? (<>
                        <div
                          className="effect-row-example"
                          style={{
                            boxShadow: `${
                              value.$value.offsetX}px ${
                              value.$value.offsetY}px ${
                              value.$value.blur}px ${
                              value.$value.spread}px ${
                              hexAlphaToCss(
                                value.$value.color,
                                value.$value.alpha
                              )}`
                          }}>
                        </div>
                        <div className="effect-row-details">
                          <div>
                            Shadow Effect
                          </div>
                          <div>
                            {value.$value.color} / {
                            value.$value.offsetX} / {
                            value.$value.offsetY} / {
                            value.$value.alpha.toFixed(3)
                            }
                          </div>
                        </div>
                      </>) : (<>
                        <div className="effect-row-example"
                          style={{
                            filter: `blur(${(value.$value.radius/2).toFixed(2)}px)`
                          }}>Ag
                        </div>
                        <div className="effect-row-details">
                          <div>
                            Blur Effect
                          </div>
                          <div>
                            {value.$value.radius}
                          </div>
                        </div>
                      </>)}
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteEffectToken(
                          value as DSysShadowToken,// either works
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
        body={(
          <EffectsDetail
            token={this.state.focusedToken}
            updateToken={(token : DSysShadowToken | DSysBlurToken) => {
              updateEffect(
                token,
                this.props.refreshTokens
              );
              this.setState({
                focusedToken: token,
              });
            }} />
        )} />
    </>);
  }

}