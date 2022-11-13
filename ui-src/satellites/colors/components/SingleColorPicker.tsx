import
  React, {
} from "react";
import "./SingleColorPicker.css";
import Colr from 'colr';
import ColorThumb from "../pages/details/colorThumb/colorThumb";
import ColorHueThumb from "../pages/details/colorHueThumb/colorHueThumb";

interface SingleColorPickerProps {
  color: string,
  style?: object,
  onColorChange: (color: string) => void,
}

export default class SingleColorPicker extends React.Component<SingleColorPickerProps> {

  constructor(props: SingleColorPickerProps | Readonly<SingleColorPickerProps>) {
    super(props);
    const colorValue = new Colr().fromHex(this.props.color);
    const colorValueHsv = colorValue.toHsvObject();
    const hueColor = new Colr().fromHsvObject({h:colorValueHsv.h,s:100,v:100});
    this.state = {
      color: this.props.color,
      hue:colorValueHsv.h,
      saturation: colorValueHsv.s,
      value: colorValueHsv.v,
      hueColor: hueColor.toHex(),
    };

    const hueGradArr: string[] = [];
    [...Array(360)].map((_:any, index:number) => {
      hueGradArr.push(` ${new Colr().fromHsvObject({
        h:index, s:100,v:100
      }).toHex()} ${((index/360)*100).toFixed(4)}%`);
    });
    this.hueGrad = hueGradArr.join(', ')
  }

  hueGrad: string;

  state : {
    color: string,
    hue: number,
    saturation: number,
    value: number,
    hueColor: string,
  }

  componentDidUpdate(prevProps: SingleColorPickerProps) {
    if (prevProps.color !== this.props.color) {
      this.changeColorHandler(this.props.color);
    }
  }

  changeColorHandler(color: string) {
    const colorValue = new Colr().fromHex(color);
    const colorValueHsv = colorValue.toHsvObject();
    this.setState({
      color,
      hue:colorValueHsv.h,
      saturation: colorValueHsv.s,
      value: colorValueHsv.v,
    });
  }

  changeHueHandler(hueColor: string) {
    const hueColorObj = new Colr().fromHex(hueColor);
    const hueColorHsv = hueColorObj.toHsvObject();
    const newColor = new Colr().fromHsvObject({
      h:hueColorHsv.h,
      s:this.state.saturation,
      v:this.state.value
    });
    this.setState({
      hueColor,
      color:newColor.toHex()
    });
    this.props.onColorChange(newColor.toHex());
  }

  render() {
    return (
      <div className="single-color-picker-box"
        style={this.props.style}>
        <div className="single-color-picker">
          <div className="single-color-picker-square"
            style={{
              background: `
                linear-gradient(
                  270deg, 
                  ${this.state.hueColor} 0%, 
                  rgba(255, 0, 0, 0) 100%
                )`
            }}>
            <div className="single-color-picker-brightness"></div>
            <ColorThumb
              color={this.state.color}
              size="large"
              onMove={(
                color: string
              ) => {
                this.changeColorHandler(color);
                this.props.onColorChange(color);
              }}>
            </ColorThumb>
          </div>
          <div
            className="single-color-picker-hue-selector"
            tabIndex={0}
            style={{
              background: `linear-gradient(180deg, ${this.hueGrad})`
            }}>
            <ColorHueThumb
              color={this.state.hueColor}
              onMove={(color: string) => {
                this.changeHueHandler(color);
              }}></ColorHueThumb>
          </div>
        </div>
      </div>
    );
  }
}

