import React, { DOMAttributes, MouseEvent } from "react";
import {
  DSysColorToken,
  DSysTokenset,
  CoreProps,
  cleanAndSortTokens,
  returnValidColor,
  validColor,
  colors,
  getIcon,
  Icons,
  dtColorToCss,
  DTColor,
} from "../../../../shared";
import DTButton, { DTButtonColor, DTButtonDesign } from "../../../components/DTButton";
import Input from "../../../components/Input";
import "./colorSteps.css";
import renderAda from "./renderAda";
import 'color-picker-web-component';
import { changeColorAction, changeNameAction } from "./actions";

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
      pickerColor: '#eeeeee'
    }
  }

  componentDidMount(): void {
    this.picker?.addEventListener("change", this.handlePickerChange);
  }

  componentWillUnmount() {
    this.picker?.removeEventListener("change", this.handlePickerChange);
  }

  handlePickerChange = (event: any) => {
    if (!this.picker || !this.state.focusedToken) return;
    const hex = `#${this.picker.hex}`;
    this.changeColor(
      hex,
      1,
      this.state.focusedToken.$extensions['dsys.name']
    );
    this.setState({
      pickerColor: hex,
    })
    this.fixMessedUpPicker();
  }

  changeColor = (
    color: string,
    alpha: number,
    name: string
  ) => {
    changeColorAction(
      color, alpha, name, 
      this.props.tokenGroup, this.props.updateTokenGroup
    );
  }

  fixMessedUpPicker() {
    // there is a timing issue within the component...
    setTimeout(() => {
      const picker = (this.picker as any);
      picker.value = this.state.pickerColor;
      picker.shadowRoot.querySelector('#gridInput')
        .setAttribute(
          'style',
          `background: ${picker._gridBackground}`
        );
      },10);
  }

  picker?: any;

  state : {
    isDeleting: boolean,
    focusedToken?: DSysColorToken,
    pickerTop: string,
    pickerLeft: string,
    pickerColor: string,
  }

  render() {
    return (<>
      <div className={`
        edit-color scroll-bar
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <table className="edit-color-table">
          {this.renderColorSteps()}
        </table>
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
          label="Close" 
          onClick={() => { 
            this.setState({
              focusedToken: undefined
            })
          }} />
      </div>
      <div className="edit-color-navigation">
        <DTButton
          label="Delete"
          design={DTButtonDesign.border}
          color={DTButtonColor.grey}
          icon={Icons.delete}
          onClick={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            })
          }} />
        <DTButton
          label="Add Color"
          design={DTButtonDesign.solid}
          color={DTButtonColor.grey}
          onClick={() => {}}
          icon={Icons.add} />
      </div>
    </>);
  }

  renderColorSteps() {
    if (!this.props.tokenGroup) return (<div>No Steps Found</div>);

    // there will only ever be one in the array...
    const tokenset = this.props.tokenGroup.tokensets[0];
    if (!tokenset) return (<div>No Steps Found</div>);

    const tokens = cleanAndSortTokens(tokenset);

    const html = tokens.map((entry) => {
      const prop = entry[0];
      const value = entry[1] as DSysColorToken;
      const color = value.$value as DTColor;
      return (
        <tr className="edit-color-row">
          <td className="edit-color-dragger">
            <div className="edit-color-dragger-icon"
              dangerouslySetInnerHTML={{ __html: 
                getIcon(Icons.drag, colors.greyLight) 
              }}></div>
          </td>
          <td className="edit-color-name">
            <Input
              hideLabel hideBorder
              label="property"
              value={prop}
              onChange={(newName: string) => {
                changeNameAction(
                  newName, prop,
                  this.props.tokenGroup, this.props.updateTokenGroup
                );
              }} />
          </td>
          <td className="edit-color-color">
            <div className="edit-color-color-chip"
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
          </td>
          <td className="edit-color-hex">
            <Input
              className="edit-color-hex-input"
              label="color" 
              hideLabel hideBorder
              value={`${color.hex}`}
              textAlign="left"
              onFocus={() => {
                this.setState({
                  focusedToken: undefined,
                });
              }}
              onChange={(value: string) => {
                this.changeColor(
                  value,
                  color.alpha,
                  prop
                );
              }} />
          </td>
          <td className="edit-color-alpha">
            <Input
              className="edit-color-alpha-input"
              label="color alpha" 
              hideLabel hideBorder
              value={`${Math.round(color.alpha * 100)}%`}
              textAlign="right"
              onChange={(value: string) => {
                const alphaFractionStr = value.replace('%', '');
                const alphaFraction = parseInt(alphaFractionStr)/100;
                this.changeColor(
                  color.hex,
                  alphaFraction,
                  prop
                );
              }} />
          </td>
          <td className="edit-color-ada">
            {renderAda(
              color,
              this.props.tokenGroup?.nodeId || tokenset.$extensions['dsys.name']
            )}
          </td>
          <td className="edit-color-deleting">
            <div className="edit-color-deleting-icon"
              dangerouslySetInnerHTML={{ __html: 
                getIcon(Icons.delete, colors.error) 
              }}></div>
          </td>
        </tr>
      );
    });
    return html;
  }
}
