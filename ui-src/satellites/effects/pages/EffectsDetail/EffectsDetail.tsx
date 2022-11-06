import
  React, {
  KeyboardEvent
} from "react";
import {
  DSysShadowToken,
  DSysBlurToken,
  DTTokenType,
  hexAlphaToCss
} from "../../../../../shared";
import Input from "../../../../components/Input";
import "./EffectsDetail.css";

interface EffectsDetailProps {
  token?: DSysShadowToken | DSysBlurToken,
  updateToken: (token: DSysShadowToken | DSysBlurToken) => void
}

export default class EffectsDetail extends React.Component<EffectsDetailProps> {

  constructor(props: EffectsDetailProps | Readonly<EffectsDetailProps>) {
    super(props);
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    const isShadow = this.props.token.$type === DTTokenType.shadow;

    if (isShadow) {
      const shadow = this.props.token as DSysShadowToken;
      return (
        <div className="effects-detail">
          <h2>Shadow Effect</h2>
          <div className="effects-detail-row">
            <Input
              label="Offset X"
              value={`${shadow.$value.offsetX}`}
              type="number"
              selectAllOnFocus={true}
              onArrowUpOrDown={(
                value: string,
                increment: number,
              ) => {
                const finalValue = parseInt(value) + increment;
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    offsetX: finalValue
                  }
                }); 
              }}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    offsetX: parseInt(value)
                  }
                });
              }} />
            <Input
              label="Offset Y"
              value={`${shadow.$value.offsetY}`}
              type="number"
              selectAllOnFocus={true}
              onArrowUpOrDown={(
                value: string,
                increment: number,
              ) => {
                const finalValue = parseInt(value) + increment;
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    offsetY: finalValue
                  }
                }); 
              }}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    offsetY: parseInt(value)
                  }
                });
              }} />
            <Input
              label="Blur"
              value={`${shadow.$value.blur}`}
              type="number"
              selectAllOnFocus={true}
              onArrowUpOrDown={(
                value: string,
                increment: number,
              ) => {
                const finalValue = Math.max(0, parseInt(value) + increment );
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    blur: finalValue
                  }
                }); 
              }}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    blur: parseInt(value)
                  }
                });
              }} />
            <Input
              label="Spread"
              value={`${shadow.$value.spread}`}
              type="number"
              selectAllOnFocus={true}
              onArrowUpOrDown={(
                value: string,
                increment: number,
              ) => {
                const finalValue = Math.max(0, parseInt(value) + increment );
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    spread: finalValue
                  }
                }); 
              }}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    spread: parseInt(value)
                  }
                });
              }} />
          </div>
          <div className="effects-detail-row">
            <Input
              label="Color"
              value={`${shadow.$value.color}`}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    color: value
                  }
                });
              }} />
            <Input
              className="effects-alpha-input"
              label="Opacity"
              value={`${shadow.$value.alpha.toFixed(2)}`}
              type="number"
              selectAllOnFocus={true}
              increments={{
                shifted: 0.1,
                unshifted: 0.01,
              }}
              onArrowUpOrDown={(
                value: string,
                increment: number,
              ) => {
                const finalValue = Math.min(
                  1, Math.max(0, parseFloat(value) + increment )
                );
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    alpha: finalValue
                  }
                }); 
              }}
              onEnterOrBlur={(value: string) => {
                this.props.updateToken({
                  ...shadow,
                  $value: {
                    ...shadow.$value,
                    alpha: parseFloat(value)
                  }
                });
              }} />
          </div>
          <div style={{flex:1}}></div>
          <div className="effects-example-box">
            <div className="effects-example"
              style={{
                boxShadow: `${
                  shadow.$value.offsetX}px ${
                  shadow.$value.offsetY}px ${
                  shadow.$value.blur}px ${
                  shadow.$value.spread}px ${
                  hexAlphaToCss(
                    shadow.$value.color,
                    shadow.$value.alpha
                  )}`
              }}>
            </div>
          </div>
        </div>
      );
    }

    const blur = this.props.token as DSysBlurToken;
    return (
      <div className="effects-detail">
        <h2>Blur Effect</h2>
        <Input
          label="Radius"
          value={`${blur.$value.radius}`}
          type="number"
          selectAllOnFocus={true}
          onArrowUpOrDown={(
            value: string,
            increment: number,
          ) => {
            const finalValue = Math.max(0, parseInt(value) + increment );
            this.props.updateToken({
              ...blur,
              $value: {
                ...blur.$value,
                radius: finalValue
              }
            }); 
          }}
          onEnterOrBlur={(value: string) => {
            this.props.updateToken({
              ...blur,
              $value: {
                ...blur.$value,
                radius: parseInt(value)
              }
            });
          }}  />
        <div style={{flex:1}}></div>
        <div className="effects-blur-example-box">
          <div className="effects-blur-example"
            style={{
              filter: `blur(${(blur.$value.radius/2).toFixed(2)}px)`
            }}>
            Quick zephyrs blow, vexing daft Jim.
          </div>
        </div>
      </div>
    );
  }
}

