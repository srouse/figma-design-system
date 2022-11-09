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

interface ColorDetailProps {
  token?: DSysColorToken,
  tokenGroup?: TokenGroup,
  refreshTokens: () => void,
  updateToken: (token: DSysColorToken) => void
}

export default class ColorDetail extends React.Component<ColorDetailProps> {

  constructor(props: ColorDetailProps | Readonly<ColorDetailProps>) {
    super(props);
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
          onColorChange={(color: string) => {
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

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }
    
    const color = this.props.token as DSysColorToken;
    const colorValue = new Colr().fromHex(color.$value.hex);
    const colorValueHsv = colorValue.toHsvObject();
    const hueColor = new Colr().fromHsvObject({h:colorValueHsv.h,s:100,v:100});

    const hueGrad: string[] = [];
    [...Array(360)].map((_:any, index:number) => {
      hueGrad.push(` ${new Colr().fromHsvObject({
        h:index, s:100,v:100
      }).toHex()} ${((index/360)*100).toFixed(4)}%`);
    });

    return (
      <div className="color-detail">
        <div className="color-picker">
          <div className="color-picker-square"
            style={{background: `linear-gradient(
              270deg, 
              ${hueColor.toHex()} 0%, 
              rgba(255, 0, 0, 0) 100%
            )`}}>
            <div className="color-picker-brightness"></div>
            {this.renderThumbs()}
          </div>
          <div
            className="color-picker-hue-selector"
            tabIndex={0}
            style={{
              background: `linear-gradient(180deg, ${hueGrad.join(',')})`
            }}>
            <ColorHueThumb
              color={hueColor.toHex()}
              onColorChange={(color: string) => {
                const tokenset = this.props.tokenGroup?.tokensets[0];
                const tokens = cleanAndSortTokens(tokenset);
                return tokens.map(tokenInfo => {
                  const token = tokenInfo[1] as DSysColorToken;
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
                });
              }}></ColorHueThumb>
          </div>
        </div>
        <div className="color-detail-row">
          <Input
            label=""
            value={color.$value.hex}
            selectAllOnFocus={true}
            onEnterOrBlur={(value: string) => {
              
            }} />
          <Input
            label=""
            value={`${color.$value.alpha * 100}`}
            selectAllOnFocus={true}
            onEnterOrBlur={(value: string) => {
              
            }} />
        </div>
      </div>
    );
  }
}

