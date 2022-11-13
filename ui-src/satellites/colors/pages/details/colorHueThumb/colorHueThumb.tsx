import React from "react";
import Colr from 'colr';
import "./colorHueThumb.css";

export type ColorHueThumbProps = {
  color: string,
  onColorChange?: (color: string) => void,
  onMove?: (color: string) => void,
}
export default class ColorHueThumb extends React.Component<ColorHueThumbProps> {

  constructor(props: ColorHueThumbProps | Readonly<ColorHueThumbProps>) {
    super(props);
    this.onMouseDownCapture = this.onMouseDownCapture.bind(this);
    this.onMouseMoveCapture = this.onMouseMoveCapture.bind(this);
    this.onMouseUpCapture = this.onMouseUpCapture.bind(this);
    this.state = this._processColor();
  }

  componentDidUpdate(prevProps: ColorHueThumbProps) {
    if (prevProps.color !== this.props.color) {
      this.setState(this._processColor());
    }
  }

  _processColor() {
    this.initColorObj = new Colr().fromHex(this.props.color);
    const colorValueHsv = this.initColorObj.toHsvObject();
    this.thumbWidth = 20;
    return {
      thumbY: (colorValueHsv.h / 360) * 100,
      color: this.initColorObj.toHex(),
    };
  }

  state : {
    thumbY: number;
    color: string;
  }

  thumbRoot? : HTMLDivElement;
  draggingThumb?: HTMLElement;
  draggingThumbHouse?: HTMLDivElement;
  isDragging: boolean = false;
  initY: number = 0;
  thumbWidth: number = 0;
  initColorObj: any;

  onMouseDownCapture(evt: any) {
    if (!this.thumbRoot) return;
    this.isDragging = true;
    this.draggingThumbHouse = this.thumbRoot?.parentElement as HTMLDivElement;
    this.initY = evt.clientY;
    document.addEventListener('mousemove', this.onMouseMoveCapture);
    document.addEventListener('mouseup', this.onMouseUpCapture);
  }

  _getMetrics(evt: any) {
    if (!this.isDragging || !this.draggingThumbHouse) return;
    const thumbHouseRect = this.draggingThumbHouse.getBoundingClientRect();
    const relativeY = evt.clientY - thumbHouseRect.top;
    const colorValueHsv = this.initColorObj.toHsvObject();
    const hue = Math.min(360, Math.max(0, 
      (relativeY / thumbHouseRect.height) * 360
    ));
    const newColor = new Colr().fromHsvObject({
      h:hue , s:colorValueHsv.s, v:colorValueHsv.v
    });
    return {
      thumbY: (hue / 360) * 100,
      color: newColor.toHex(),
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
    if (this.props.onColorChange) this.props.onColorChange(metrics.color);
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMoveCapture);
    document.removeEventListener('mouseup', this.onMouseUpCapture);
  }

  render() {
    return (
      <div
      ref={(thumbRoot: HTMLDivElement) => this.thumbRoot = thumbRoot}
        className="color-picker-hue-thumb"
        style={{
          top: `calc( ${this.state.thumbY}% - ${this.thumbWidth/2}px )`,
          left:  0,
        }}
        onMouseDown={this.onMouseDownCapture}
        onMouseMove={this.onMouseMoveCapture}
        onMouseUp={this.onMouseUpCapture}>
        <div className="color-picker-hue-thumb-inner"
          style={{
            backgroundColor: this.state.color,
          }}>
        </div>
      </div>
    );
  }

}
