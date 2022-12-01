import
  React from "react";
import { DSysSvgToken } from "../../../../shared/types/designSystemTypes";
import Input from "../../../components/Input";
import "./iconsDetail.css";

interface IconsDetailProps {
  token?: DSysSvgToken,
  updateToken: (token: DSysSvgToken) => void
}

export default class IconsDetail extends React.Component<IconsDetailProps> {

  constructor(props: IconsDetailProps | Readonly<IconsDetailProps>) {
    super(props);
  }

  render() {
    if (!this.props.token) {
      return (<div>no token</div>);
    }

    return (
      <div className="effects-detail">
        <div
          className="icon-preview"
          dangerouslySetInnerHTML={{__html:
            this.props.token.$value.svg
          }}>
        </div>
        <Input
          label="Name"
          value={this.props.token.$extensions["dsys.name"]}
          onEnterOrBlur={(name: string) => {
            // this.setState({icon:{...this.state.icon,name}});
          }} />
      </div>
    );
  }
}

