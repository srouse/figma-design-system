import
  React from "react";
import { MessageRequest } from "../../../../shared";
import { DSysSvgToken } from "../../../../shared/types/designSystemTypes";
import Input from "../../../components/Input";
import postMessagePromise from "../../../utils/postMessagePromise";
import "./iconsDetail.css";

interface IconsDetailProps {
  token?: DSysSvgToken,
  updateToken: (token: DSysSvgToken) => void
}

export default class IconsDetail extends React.Component<IconsDetailProps> {

  constructor(props: IconsDetailProps | Readonly<IconsDetailProps>) {
    super(props);
    this.state = {
      token: props.token,
    }
  }

  state: {
    token?: DSysSvgToken,
  }

  async changeScale(
    newScale: number,
    componentId: string
  ) {
    const finalScale = Math.max(0,Math.min(0.9 ,
      newScale
    ));
    const result = await postMessagePromise(
      MessageRequest.setIconScale,
      {
        componentId,
        scale: finalScale,
      }
    ) as any;
    if (result && result.icon) {
      this.setState({
        token: result.icon,
      });
    }
  }

  async changeOffsetX(
    newOffsetX: number,
    componentId: string
  ) {
    const finalOffsetX = Math.max(-0.3,Math.min(0.3 ,
      newOffsetX
    ));
    const result = await postMessagePromise(
      MessageRequest.setIconOffsetX,
      {
        componentId,
        offsetX: finalOffsetX,
      }
    ) as any;
    if (result && result.icon) {
      this.setState({
        token: result.icon,
      });
    }
  }

  async changeOffsetY(
    newOffsetX: number,
    componentId: string
  ) {
    const finalOffsetY = Math.max(-0.3,Math.min(0.3 ,
      newOffsetX
    ));
    const result = await postMessagePromise(
      MessageRequest.setIconOffsetY,
      {
        componentId,
        offsetY: finalOffsetY,
      }
    ) as any;
    if (result && result.icon) {
      this.setState({
        token: result.icon,
      });
    }
  }

  render() {
    if (!this.state.token) {
      return (<div>no token</div>);
    }

    const componentId = this.state.token.$extensions['dsys.componentId'];

    // clip paths are not scaling correctly
    let svg = this.state.token.$value.svg;
    svg = svg ? svg.replace(/clip-path/g, 'clip-path-off') : '';

    return (
      <div className="effects-detail">
        <div className="icon-preview-box">
          <div
            className="icon-preview"
            dangerouslySetInnerHTML={{__html:svg}}>
          </div>
        </div>
        <div
          className="icon-editors">
          <Input
            label="Scale"
            type="number"
            value={`${
              this.state.token.$extensions["dsys.scale"].toFixed(2)
            }`}
            increments={{
              shifted: 0.1,
              unshifted: 0.01,
            }}
            onArrowUpOrDown={async (
              value: string,
              increment: number,
            ) => {
              this.changeScale(
                parseFloat(value) + increment,
                componentId
              );
            }}
            onEnterOrBlur={async (scale: string) => {
              this.changeScale(
                parseFloat( scale ),
                componentId
              );
            }} />
          <Input
            label="X Offset"
            type="number"
            value={`${
              this.state.token.$extensions["dsys.offsetX"].toFixed(2)
            }`}
            increments={{
              shifted: 0.1,
              unshifted: 0.01,
            }}
            onArrowUpOrDown={(
              offsetX: string,
              increment: number,
            ) => {
              this.changeOffsetX(
                parseFloat(offsetX) + increment,
                componentId
              );
            }}
            onEnterOrBlur={(offsetX: string) => {
              this.changeOffsetX(
                parseFloat( offsetX ),
                componentId
              );
            }} />
          <Input
            label="Y Offset"
            type="number"
            value={`${
              this.state.token.$extensions["dsys.offsetY"].toFixed(2)
            }`}
            increments={{
              shifted: 0.1,
              unshifted: 0.01,
            }}
            onArrowUpOrDown={(
              offsetY: string,
              increment: number,
            ) => {
              this.changeOffsetY(
                parseFloat(offsetY) + increment,
                componentId
              );
            }}
            onEnterOrBlur={(offsetY: string) => {
              this.changeOffsetY(
                parseFloat( offsetY ),
                componentId
              );
            }} />
        </div>
        <Input
          className="name-input"
          label="Name"
          value={this.state.token.$extensions["dsys.name"]}
          onEnterOrBlur={(newName: string) => {
            postMessagePromise(
              MessageRequest.changeIconTokenName,
              {
                componentId,
                newName
              }
            );
          }} />
      </div>
    );
  }
}

