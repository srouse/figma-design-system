import React, {
  DOMAttributes,
} from "react";
import {
  DSysColorToken,
  CoreProps,
  cleanAndSortTokens,
  validColor,
  colors,
  getIcon,
  Icons,
  DTColor,
  MessageRequest,
} from "../../../../../shared";

import Input from "../../../../components/Input";
import "./colorList.css";
import "./colorRow.css";
import renderAda from "./renderAda";
import {
  addColorToken,
  changeColor,
  changeName,
  changeOrder,
  deleteColorToken
} from "../../utils/colorActions";
import DragAndDropList from "../../../../components/DragAndDropList/dragAndDropList";
import postMessagePromise from "../../../../utils/postMessagePromise";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import DetailModal from "../../../../components/DetailModal/DetailModal";
import ColorDetail from "../details/colorDetail";

type CustomEvents<K extends string> = { [key in K] : (event: CustomEvent) => void };
type CustomElement<T, K extends string> = Partial<T & DOMAttributes<T> & { children: any } & CustomEvents<`on${K}`>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['color-picker']: CustomElement<any, 'input' | 'change'>;
    }
  }
}

function getOffset(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}

export default class ColorSteps extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
      pickerLeft: '0px',
      pickerTop: '0px',
      pickerColor: '#eeeeee',
      pickerAlpha: '100',
      detailModalOpen: false,
    };
  }

  fixMessedUpPicker() {
    // there is a timing issue within the component..
    const picker = (this.picker as any);
    if (!picker) return;
    // picker.removeEventListener("change", this.handlePickerChange);
    setTimeout(() => {
      picker.value = this.state.pickerColor;
      picker.alpha = this.state.pickerAlpha;
      picker.shadowRoot.querySelector('#gridInput')
        .setAttribute(
          'style',
          `background: ${picker._gridBackground}`
        );
      // picker.addEventListener("change", this.handlePickerChange);
    },
    10);
  }

  picker?: any;

  state : {
    isDeleting: boolean,
    focusedToken?: DSysColorToken,
    pickerTop: string,
    pickerLeft: string,
    pickerColor: string,
    pickerAlpha: string,
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
          title="Color Tokens"
          onAdd={() =>{
            addColorToken(
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
              const colorToken = tokenInfo[1] as DSysColorToken;
              const colorValue = colorToken.$value as DTColor;
              return (
                <div
                  className="dsys-row"
                  key={`color-${colorToken.$extensions['dsys.styleId']}`}
                  data-key={`color-${colorToken.$extensions['dsys.styleId']}`}>
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
                    className="color-row-summary"
                    onClick={() => {
                      this.setState({
                        focusedToken: colorToken,
                        detailModalOpen: true
                      });
                    }}>
                    <div className="color-row-color-chip"
                      style={{
                        backgroundColor: colorValue.hex,
                        opacity: colorValue.alpha,
                      }}>
                      {validColor(colorValue) ? '' : '!!'}
                    </div>
                    <div className="color-row-summary-text">
                      {colorValue.hex} / {Math.round(colorValue.alpha * 100)}%
                    </div>
                    {/*<div className="color-row-hex">
                      <Input
                        className="color-row-hex-input"
                        label="color" 
                        hideLabel hideBorder
                        value={`${color.hex}`}
                        textAlign="left"
                        onFocus={() => {
                          this.setState({
                            focusedToken: undefined,
                          });
                        }}
                        onEnterOrBlur={(value: string) => {
                          changeColor(
                            value,
                            color.alpha,
                            prop,
                            this.props.tokenGroup,
                            this.props.refreshTokens
                          );
                        }} />
                    </div>
                    <div className="color-row-alpha">
                      <Input
                        className="color-row-alpha-input"
                        label="color alpha" 
                        hideLabel hideBorder
                        value={`${Math.round(color.alpha * 100)}%`}
                        textAlign="right"
                        increments={{shifted:10, unshifted: 1}}
                        onArrowUpOrDown={(
                          value: string,
                          increment: number
                        ) => {
                          const alphaFractionStr = value.replace('%', '');
                          const alphaFraction = Math.max(
                            0, Math.min(
                              1, (parseInt(alphaFractionStr) + increment)/100
                            )
                          );
                          changeColor(
                            color.hex,
                            alphaFraction,
                            prop,
                            this.props.tokenGroup,
                            this.props.refreshTokens
                          );
                        }}
                        onEnterOrBlur={(value: string) => {
                          const alphaFractionStr = value.replace('%', '');
                          const alphaFraction = parseInt(alphaFractionStr)/100;
                          changeColor(
                            color.hex,
                            alphaFraction,
                            prop,
                            this.props.tokenGroup,
                            this.props.refreshTokens
                          );
                        }} />
                    </div>*/}
                    <div className="color-row-ada">
                      {renderAda(
                        colorValue,
                        this.props.tokenGroup?.nodeId || tokenset.$extensions['dsys.name']
                      )}
                    </div>
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteColorToken(
                          colorToken,
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
      {/*<div
        className="edit-color-picker"
        style={{
          left: this.state.pickerLeft,
          top: this.state.pickerTop,
          display: this.state.focusedToken ? 'flex' : 'none',
        }}>
        <color-picker
          ref={(picker: any) => this.picker = picker}
          formats="hex"
          selectedformat="hex"
        ></color-picker>
        <DTButton
          className="edit-color-picker-btn"
          design={DTButtonDesign.border}
          color={DTButtonColor.grey}
          label="Apply" 
          onClick={() => {
            if (!this.picker || !this.state.focusedToken) return;
            const hex = `#${this.picker.hex}`;
            changeColor(
              hex,
              this.picker.alpha,
              this.state.focusedToken.$extensions['dsys.name'],
              this.props.tokenGroup,
              this.props.refreshTokens
            );
            this.setState({
              focusedToken: undefined
            });
          }} />
        </div>*/}
      <DetailModal
        title={this.state.focusedToken?.$extensions["dsys.name"]}
        onClose={() => {
          this.setState({
            detailModalOpen: false
          });
        }}
        open={this.state.detailModalOpen}
        body={(
          <ColorDetail
            token={this.state.focusedToken}
            updateToken={(token : DSysColorToken) => {
              changeColor(
                token.$value.hex,
                token.$value.alpha,
                token.$extensions['dsys.name'],
                this.props.tokenGroup,
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
