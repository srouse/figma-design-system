import React, {
  DOMAttributes,
  KeyboardEvent,
  MouseEvent,
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
} from "../../../../shared";
import DTButton, {
  DTButtonColor,
  DTButtonDesign
} from "../../../components/DTButton";
import Input from "../../../components/Input";
import "./colorList.css";
import "./colorRow.css";
import "../../../components/DragAndDropList/dsysList.css";
import "../../../components/DragAndDropList/dsysRow.css";
import renderAda from "./renderAda";
import 'color-picker-web-component';
import {
  addColorToken,
  changeColor,
  changeName,
  changeOrder,
  deleteColorToken
} from "./colorActions";
import DragAndDropList from "../../../components/DragAndDropList/dragAndDropList";
import postMessagePromise from "../../../utils/postMessagePromise";
import ListHeader from "../../../components/ListHeader/ListHeader";

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
              token, index,
              onMouseDownCapture,
              onMouseUpCapture,
            ) => {
              const prop = token[0];
              const value = token[1] as DSysColorToken;
              const color = value.$value as DTColor;
              return (
                <div
                  className="dsys-row"
                  key={`color-${value.$extensions['dsys.styleId']}`}
                  data-key={`color-${value.$extensions['dsys.styleId']}`}>
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
                  <div className="color-row-color">
                    <div className="color-row-color-chip"
                      style={{
                        backgroundColor: color.hex,
                        opacity: color.alpha,
                      }}
                      onClick={(evt: MouseEvent) => {
                        const pickerSize = {width: 240, height: 294};
                        const viewSize = {width: 460, height: 560};
                        const absTop = 110;
                        const chipOffset = getOffset( evt.target as HTMLElement );
                        this.setState({
                          focusedToken: value,
                          pickerColor: color.hex,
                          pickerAlpha: color.alpha,
                          pickerTop: `${
                            Math.min(
                              viewSize.height - pickerSize.height,
                              chipOffset.top - absTop - 15
                            )
                          }px`
                        });
                        this.fixMessedUpPicker();
                      }}>
                      {validColor(color) ? '' : '!!'}
                    </div>
                  </div>
                  <div className="color-row-hex">
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
                      onArrowUpOrDown={(
                        value: string,
                        direction: 'up' | 'down',
                        evt: KeyboardEvent<HTMLInputElement>
                      ) => {
                        const alphaFractionStr = value.replace('%', '');
                        let increment = evt.shiftKey ? 10 : 1;
                        if (direction === 'down') {
                          increment = increment * -1;
                        }
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
                  </div>
                  <div className="color-row-ada">
                    {renderAda(
                      color,
                      this.props.tokenGroup?.nodeId || tokenset.$extensions['dsys.name']
                    )}
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteColorToken(
                          value,
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
      <div
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
      </div>
    </>);
  }

}
