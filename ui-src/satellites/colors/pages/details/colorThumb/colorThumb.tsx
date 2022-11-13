
import React, { MouseEvent, MouseEventHandler } from "react";
import Colr from 'colr';
import "./colorThumb.css";

export type ColorThumbProps = {
  color: string,
  size: 'large' | 'small',
  onColorChange?: (color: string) => void,
  onMove?: (color: string) => void,
}
export default class ColorThumb extends React.Component<ColorThumbProps> {

  constructor(props: ColorThumbProps | Readonly<ColorThumbProps>) {
    super(props);
    this.onMouseDownCapture = this.onMouseDownCapture.bind(this);
    this.onMouseMoveCapture = this.onMouseMoveCapture.bind(this);
    this.onMouseUpCapture = this.onMouseUpCapture.bind(this);
    this.thumbWidth = this.props.size === 'large' ? 20 : 10;
    this.state = this._processColor();
  }

  componentDidUpdate(prevProps: ColorThumbProps) {
    if (prevProps.color !== this.props.color) {
      this.setState(this._processColor());
    }
  }

  _processColor() {
    this.initColorObj = new Colr().fromHex(this.props.color);
    const colorValueHsv = this.initColorObj.toHsvObject();
    return {
      thumbX: colorValueHsv.s,
      thumbY: 100-colorValueHsv.v,
      color: this.initColorObj.toHex(),
    };
  }

  state : {
    thumbX: number;
    thumbY: number;
    color: string;
  }

  thumbRoot? : HTMLDivElement;
  draggingThumb?: HTMLElement;
  draggingThumbHouse?: HTMLDivElement;
  isDragging: boolean = false;
  initX: number = 0;
  initY: number = 0;
  thumbWidth: number = 0;
  initColorObj: any;

  onMouseDownCapture(evt: any) {
    if (!this.thumbRoot) return;
    this.isDragging = true;
    this.draggingThumbHouse = this.thumbRoot?.parentElement as HTMLDivElement;
    this.initX = evt.clientX;
    this.initY = evt.clientY;
    document.addEventListener('mousemove', this.onMouseMoveCapture);
    document.addEventListener('mouseup', this.onMouseUpCapture);
  }

  _getMetrics(evt: any) {
    if (!this.isDragging || !this.draggingThumbHouse) return;
    const thumbHouseRect = this.draggingThumbHouse.getBoundingClientRect();
    const relativeX = evt.clientX - thumbHouseRect.left;
    const relativeY = evt.clientY - thumbHouseRect.top;
    const saturation = Math.round(Math.max(
      0, Math.min(
        1, relativeX / thumbHouseRect.width)
    ) * 100);
    const value = Math.round(100 - (Math.max(
      0, Math.min(
        1, relativeY / thumbHouseRect.height)
    ) * 100));
    const colorValueHsv = this.initColorObj.toHsvObject();
    const newColor = new Colr().fromHsvObject({
      h:colorValueHsv.h, s:saturation, v:value
    });
    return {
      thumbX: saturation,
      thumbY: 100 - value,
      color: newColor.toHex(),
      saturation,
      value,
    };
  }

  onMouseMoveCapture(evt: any) {
    const metrics = this._getMetrics(evt);
    if (!metrics) return;
    this.setState(metrics);
    if (this.props.onMove) this.props.onMove(metrics.color);
  }

  onMouseUpCapture(evt: any) {
    const metrics = this._getMetrics(evt);
    if (!metrics) return;
    this.setState(metrics);
    if (this.props.onColorChange) {
      this.props.onColorChange(
        metrics.color,
      );
    }
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMoveCapture);
    document.removeEventListener('mouseup', this.onMouseUpCapture);
  }

  render() {
    return (
      <div
      ref={(thumbRoot: HTMLDivElement) => this.thumbRoot = thumbRoot}
        className={this.props.size === 'small' ?
          'color-picker-small-thumb' : 'color-picker-thumb'
        }
        style={{
          left: `calc( ${this.state.thumbX}% - ${this.thumbWidth/2}px )`,
          top:  `calc( ${this.state.thumbY}% - ${this.thumbWidth/2}px )`,
        }}
        onMouseDown={this.onMouseDownCapture}
        onMouseMove={this.onMouseMoveCapture}
        onMouseUp={this.onMouseUpCapture}>
        <div className={this.props.size === 'small' ?
            'color-picker-small-thumb-inner' : 'color-picker-thumb-inner'
          }
          style={{
            backgroundColor: this.state.color,
          }}>
        </div>
      </div>
    );
  }

}
