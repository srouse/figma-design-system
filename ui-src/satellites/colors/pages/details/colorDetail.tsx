import
  React, {
} from "react";
import {

  DSysColorToken,
} from "../../../../../shared";
import "./colorDetail.css";
import "./colorPicker.css";
import Colr from 'colr';

interface ColorDetailProps {
  token?: DSysColorToken,
  updateToken: (token: DSysColorToken) => void
}

export default class ColorDetail extends React.Component<ColorDetailProps> {

  constructor(props: ColorDetailProps | Readonly<ColorDetailProps>) {
    super(props);
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }
    const thumbWidth = 20;
    const color = this.props.token as DSysColorToken;
    const colorValue = new Colr().fromHex(color.$value.hex);
    const colorValueHsv = colorValue.toHsvObject();
    const hueColor = new Colr().fromHsvObject({h:colorValueHsv.h,s:100,v:100});
    
    console.log('colorValue',  colorValue.toRgbObject());
    console.log('colorValue', colorValue.toHsvObject());
    console.log('colorValue', colorValue.toHex());
    console.log('hueColor',  hueColor.toRgbObject());
    console.log('hueColor', hueColor.toHsvObject());
    console.log('hueColor', hueColor.toHex());

    const hueGrad: string[] = [];
    [...Array(360)].map((_:any, index:number) => {
      hueGrad.push(` ${new Colr().fromHsvObject({
        h:index, s:100,v:100
      }).toHex()} ${((index/360)*100).toFixed(4)}%`);
    });

    
    return (
      <div className="color-detail">
        <div className="color-picker"
          style={{background: `linear-gradient(
            270deg, 
            ${hueColor.toHex()} 0%, 
            rgba(255, 0, 0, 0) 100%
          )`}}>
          <div className="color-picker-brightness"></div>
          <div className="color-picker-thumb"
            style={{
              left: `calc( ${colorValueHsv.s}% - ${thumbWidth/2}px )`,
              top:  `calc( ${100-colorValueHsv.v}% - ${thumbWidth/2}px )`
            }}>
            <div className="color-picker-thumb-inner"
              style={{
                backgroundColor: colorValue.toHex(),
              }}>
            </div>
          </div>
        </div>
        <div className="color-picker-hue-selector"
          style={{
            background: `linear-gradient(90deg, ${hueGrad.join(',')})`
          }}>
          <div className="color-picker-thumb"
            style={{
              left: `calc( ${(hueColor.toHsvObject().h/360)*100}% - ${thumbWidth/2}px )`,
            }}>
            <div className="color-picker-thumb-inner"
              style={{
                backgroundColor: hueColor.toHex(),
              }}>
              {hueColor.h}
            </div>
          </div>
        </div>
        <h2>Color</h2>
        <div>
          {color.$value.hex}
        </div>
      </div>
    );
  }
}

