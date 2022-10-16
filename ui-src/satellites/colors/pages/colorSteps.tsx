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
import "./colorSteps.css";
import "./colorStepRow.css";
import renderAda from "./renderAda";
import 'color-picker-web-component';
import {
  addColorToken,
  changeColorAction,
  changeNameAction,
  changeOrder,
  deleteColorToken
} from "./actions";
import DragAndDropList from "../../../utils/dragAndDropList";
import postMessagePromise from "../../../utils/postMessagePromise";

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
    }
  }

  changeColor = (
    color: string,
    alpha: number,
    name: string
  ) => {
    changeColorAction(
      color, alpha, name, 
      this.props.tokenGroup,
      this.props.refreshTokens
    );
  }

  fixMessedUpPicker() {
    // there is a timing issue within the component..
    console.log('fixPicker');
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
        edit-color scroll-bar
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
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
                className="color-step-row"
                key={`color-${value.$extensions['dsys.styleId'] || index}}`}>
                <div className="color-step-row-dragger"
                  dangerouslySetInnerHTML={{ __html: 
                    getIcon(Icons.drag, colors.greyLight) 
                  }}
                  onMouseDown={onMouseDownCapture}
                  onMouseUp={onMouseUpCapture}>
                </div>
                <div className="color-step-row-name">
                  <Input
                    hideLabel hideBorder
                    label="property"
                    value={prop}
                    onEnterOrBlur={(newName: string) => {
                      changeNameAction(
                        newName, prop,
                        this.props.tokenGroup,
                        this.props.refreshTokens
                      );
                    }} />
                </div>
                <div className="color-step-row-color">
                  <div className="color-step-row-color-chip"
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
                <div className="color-step-row-hex">
                  <Input
                    className="color-step-row-hex-input"
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
                      this.changeColor(
                        value,
                        color.alpha,
                        prop
                      );
                    }} />
                </div>
                <div className="color-step-row-alpha">
                  <Input
                    className="color-step-row-alpha-input"
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
                      this.changeColor(
                        color.hex,
                        alphaFraction,
                        prop
                      );
                    }}
                    onEnterOrBlur={(value: string) => {
                      const alphaFractionStr = value.replace('%', '');
                      const alphaFraction = parseInt(alphaFractionStr)/100;
                      this.changeColor(
                        color.hex,
                        alphaFraction,
                        prop
                      );
                    }} />
                </div>
                <div className="color-step-row-ada">
                  {renderAda(
                    color,
                    this.props.tokenGroup?.nodeId || tokenset.$extensions['dsys.name']
                  )}
                </div>
                <div className="color-step-row-deleting"
                  onClick={() => {
                    if (this.state.isDeleting) {
                      if (!this.props.tokenGroup) return;
                      deleteColorToken(
                        value,
                        this.props.refreshTokens
                      );
                    }
                  }}>
                  <div className="color-step-row-deleting-icon"
                    dangerouslySetInnerHTML={{ __html: 
                      getIcon(Icons.delete, colors.error) 
                    }}></div>
                </div>
              </div>
            );
          }}>
        </DragAndDropList>
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
            this.changeColor(
              hex,
              this.picker.alpha,
              this.state.focusedToken.$extensions['dsys.name']
            );
            this.setState({
              focusedToken: undefined
            });
          }} />
      </div>
      <div className="edit-color-navigation">
        <DTButton
          label={this.state.isDeleting ? 'Cancel Delete' : 'Delete'}
          design={DTButtonDesign.border}
          color={DTButtonColor.grey}
          icon={this.state.isDeleting ? Icons.deleteCancel : Icons.delete}
          onClick={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
          }} />
        <DTButton
          label="Add Color"
          design={DTButtonDesign.solid}
          color={DTButtonColor.grey}
          onClick={() => {
            addColorToken(
              this.props.tokenGroup,
              this.props.refreshTokens,
            ).then(result => {
              if (result.success === false) {
                console.log(result)
                postMessagePromise(
                  MessageRequest.notify,
                  {message: result.message, error: true}
                );
              }
            });
          }}
          icon={Icons.add} />
      </div>
    </>);
  }

}
