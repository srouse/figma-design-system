import
  React, {
} from "react";
import {
  cleanAndSortTokens,
  DSysColorToken,
  TokenGroup,
} from "../../../../../shared";
import "./colorDetail.css";
import "./colorPicker.css";
import Colr from 'colr';
import ColorThumb from "./colorThumb/colorThumb";
import { changeColor } from "../../utils/colorActions";
import ColorHueThumb from "./colorHueThumb/colorHueThumb";
import Input from "../../../../components/Input";
import Checkbox from "../../../../components/Checkbox";

interface ColorDetailProps {
  token?: DSysColorToken,
  tokenGroup?: TokenGroup,
  refreshTokens: () => void,
  updateToken: (token: DSysColorToken) => void
}

export default class ColorDetail extends React.Component<ColorDetailProps> {

  constructor(props: ColorDetailProps | Readonly<ColorDetailProps>) {
    super(props);
    const color = this.props.token as DSysColorToken;
    const colorValue = new Colr().fromHex(color.$value.hex);
    const colorValueHsv = colorValue.toHsvObject();
    const hueColor = new Colr().fromHsvObject({h:colorValueHsv.h,s:100,v:100});

    this.state = {
      hue:colorValueHsv.h,
      saturation: colorValueHsv.s,
      value: colorValueHsv.v,
      hueColor: hueColor.toHex(),
      lockHue: false,
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
    hue: number,
    saturation: number,
    value: number,
    hueColor: string,
    lockHue: boolean,
  }

  componentDidUpdate(prevProps: ColorDetailProps) {
    if (prevProps.token !== this.props.token) {
      const color = this.props.token as DSysColorToken;
      const colorValue = new Colr().fromHex(color.$value.hex);
      const colorValueHsv = colorValue.toHsvObject();
      const hueColor = new Colr().fromHsvObject({h:colorValueHsv.h,s:100,v:100});

      this.setState({
        hue:colorValueHsv.h,
        saturation: colorValueHsv.s,
        value: colorValueHsv.v,
        hueColor: hueColor.toHex(),
      });
    }
  }

  renderThumbs() {
    if (
      !this.props.token ||
      !this.props.tokenGroup ||
      !this.props.tokenGroup.tokensets ||
      this.props.tokenGroup.tokensets.length === 0
    ) return;
    const tokenset = this.props.tokenGroup?.tokensets[0];
    const tokens = cleanAndSortTokens(tokenset);
    return tokens.map(tokenInfo => {
      const token = tokenInfo[1] as DSysColorToken;
      const isFocusedToken = token.$extensions["dsys.styleId"] === 
        this.props.token!.$extensions["dsys.styleId"];
      return (
        <ColorThumb
          key={`thumb-${token.$extensions["dsys.styleId"]}`}
          color={token.$value.hex}
          size={isFocusedToken ? 'large' : 'small'}
          onColorChange={(
            color: string
          ) => {
            changeColor(
              color,
              token.$value.alpha,
              token.$extensions["dsys.name"],
              this.props.tokenGroup,
              this.props.refreshTokens
            );
          }}>
        </ColorThumb>
      );
      
    })
  }

  changeColorHandler(newColor : string) {
    changeColor(
      newColor,
      this.props.token!.$value.alpha,
      this.props.token!.$extensions["dsys.name"],
      this.props.tokenGroup,
      this.props.refreshTokens
    );
  }

  changeHueHandler(color: string) {
    const tokenset = this.props.tokenGroup?.tokensets[0];
    const tokens = cleanAndSortTokens(tokenset);
    return tokens.map(tokenInfo => {
      const token = tokenInfo[1] as DSysColorToken;
      if (
        this.state.lockHue ||
        token.$extensions["dsys.styleId"] === 
        this.props.token?.$extensions["dsys.styleId"] 
      ) {
        const tokenColor = new Colr().fromHex(token.$value.hex);
        const tokenColorHsv = tokenColor.toHsvObject();
        const newColor = new Colr().fromHex(color);
        const newColorHsv = newColor.toHsvObject();
        const newTokenColor = new Colr().fromHsvObject({
          h:newColorHsv.h,
          s:tokenColorHsv.s,
          v:tokenColorHsv.v,
        });
        changeColor(
          newTokenColor.toHex(),
          token!.$value.alpha,
          token!.$extensions["dsys.name"],
          this.props.tokenGroup,
          this.props.refreshTokens
        );
      }
    });
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    const color = this.props.token as DSysColorToken;
    return (
      <div className="color-detail">
        <div className="color-picker">
          <div className="color-picker-square"
            style={{background: `linear-gradient(
              270deg, 
              ${this.state.hueColor} 0%, 
              rgba(255, 0, 0, 0) 100%
            )`}}>
            <div className="color-picker-brightness"></div>
            {this.renderThumbs()}
          </div>
          <div
            className="color-picker-hue-selector"
            tabIndex={0}
            style={{
              background: `linear-gradient(180deg, ${this.hueGrad})`
            }}>
            <ColorHueThumb
              color={this.state.hueColor}
              onMove={(color: string) => {
                this.setState({
                  hueColor: color,
                })
              }}
              onColorChange={(color: string) => {
                this.changeHueHandler(color);
              }}></ColorHueThumb>
          </div>
        </div>
        
        <div className="color-detail-row">
          <Input
            label="hex"
            value={color.$value.hex}
            selectAllOnFocus={true}
            onEnterOrBlur={(value: string) => {
              changeColor(
                value,
                this.props.token!.$value.alpha,
                this.props.token!.$extensions["dsys.name"],
                this.props.tokenGroup,
                this.props.refreshTokens
              );
            }} />
          <Input
            label="alpha"
            className="color-detail-alpha"
            value={`${Math.round(color.$value.alpha * 100)}`}
            selectAllOnFocus={true}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              changeColor(
                color.$value.hex,
                Math.max(0, Math.min(1, (parseInt(value) + increment) / 100)),
                this.props.token!.$extensions["dsys.name"],
                this.props.tokenGroup,
                this.props.refreshTokens
              );
            }}
            onEnterOrBlur={(value: string) => {
              changeColor(
                color.$value.hex,
                Math.max(0, Math.min(1, parseInt(value) / 100 )),
                this.props.token!.$extensions["dsys.name"],
                this.props.tokenGroup,
                this.props.refreshTokens
              );
            }} />
          <Input
            label="hue"
            className="color-detail-hue"
            value={`${this.state.hue}`}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              this.changeHueHandler(
                new Colr().fromHsvObject({
                  h:parseInt(value) + increment,
                  s:this.state.saturation,
                  v:this.state.value,
                }).toHex()
              );
            }}
            onEnterOrBlur={(value: string) => {
              this.changeHueHandler(
                new Colr().fromHsvObject({
                  h:parseInt(value),
                  s:this.state.saturation,
                  v:this.state.value,
                }).toHex()
              );
            }} />
          <Input
            label="saturation"
            className="color-detail-saturation"
            value={`${this.state.saturation}`}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              this.changeColorHandler(
                new Colr().fromHsvObject({
                  h:this.state.hue,
                  s:parseInt(value) + increment,
                  v:this.state.value,
                }).toHex()
              );
            }}
            onEnterOrBlur={(value: string) => {
              this.changeColorHandler(
                new Colr().fromHsvObject({
                  h:this.state.hue,
                  s:parseInt(value),
                  v:this.state.value,
                }).toHex()
              );
            }} />
          <Input
            label="value"
            className="color-detail-value"
            value={`${this.state.value}`}
            onArrowUpOrDown={(
              value: string,
              increment: number,
            ) => {
              this.changeColorHandler(
                new Colr().fromHsvObject({
                  h:this.state.hue,
                  s:this.state.saturation,
                  v:parseInt(value) + increment,
                }).toHex()
              );
            }}
            onEnterOrBlur={(value: string) => {
              this.changeColorHandler(
                new Colr().fromHsvObject({
                  h:this.state.hue,
                  s:this.state.saturation,
                  v:parseInt(value),
                }).toHex()
              );
            }} />
        </div>
        <div className="color-detail-row">
          <Checkbox
            className="lockHueCheckbox" 
            label="Lock Hue"
            value={this.state.lockHue}
            onChange={(value: boolean) => {
              this.setState({
                lockHue: value,
              });
            }} />
        </div>
      </div>
    );
  }
}

