import
  React from "react";
import { Icons, MessageRequest } from "../../../../shared";
import { DSysSvgToken } from "../../../../shared/types/designSystemTypes";
import DTButton, { DTButtonColor } from "../../../components/DTButton";
import Input from "../../../components/input";
import postMessagePromise from "../../../utils/postMessagePromise";
import "./iconsDetail.css";

interface IconsDetailProps {
  token?: DSysSvgToken
}

export default class IconsDetail extends React.Component<IconsDetailProps> {

  constructor(props: IconsDetailProps | Readonly<IconsDetailProps>) {
    super(props);
    this.state = {
      token: props.token,
      updating: false,
    }
  }

  state: {
    token?: DSysSvgToken,
    updating: boolean,
  }

  async changeName(
    newName: string,
    componentId: string
  ) {
    const result = await postMessagePromise(
      MessageRequest.changeIconTokenName,
      {
        componentId,
        newName,
      }
    ) as any;
    if (result && result.icon) {
      this.setState({
        token: result.icon,
      });
    }
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

    const scale = this.state.token.$extensions["dsys.scale"] || 0.1;
    const offsetX = this.state.token.$extensions["dsys.offsetX"] || 0.0;
    const offsetY = this.state.token.$extensions["dsys.offsetY"] || 0.0;

    return (
      <div className="effects-detail">
        <Input
          className="name-input"
          label="Name"
          value={this.state.token.$extensions["dsys.name"]}
          onEnterOrBlur={(newName: string) => {
            this.changeName(
              newName,
              componentId
            );
          }} />
        <div className="icon-preview-box">
          <div
            className="icon-preview"
            dangerouslySetInnerHTML={{__html:svg}}>
          </div>
          <div
            className="icon-editors">
            <Input
              label="Scale"
              type="number"
              value={`${
                scale.toFixed(2)
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
                offsetX.toFixed(2)
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
                offsetY.toFixed(2)
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
        </div>
        <DTButton
          label={this.state.updating ? 'Loading...' : 'Save'}
          color={DTButtonColor.primary}
          onClick={async () => {
            this.setState({
              updating: true,
            });
            await postMessagePromise(
              MessageRequest.refreshIconTokens,
            );
            this.setState({
              updating: false,
            });
          }}/>
      </div>
    );
  }
}

