import React from "react";
import { DSysShadowToken, DSysTypographyToken } from "../../../../../shared";
import { DSysBlurToken } from "../../../../../shared/types/designSystemTypes";
import "./EffectsDetail.css";

interface EffectsDetailProps {
  token?: DSysShadowToken | DSysBlurToken,
}

export default class EffectsDetail extends React.Component<EffectsDetailProps> {

  constructor(props: EffectsDetailProps | Readonly<EffectsDetailProps>) {
    super(props);
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    return (
      <div className={`effects-detail`}>
        hi
      </div>
    );
  }
}

