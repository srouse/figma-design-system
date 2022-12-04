import React from "react";
import { CoreProps, DSysComponentToken, MessageRequest } from "../../../../../shared";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";

export default class ComponentsSettings extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      components: []
    }
    this.getComponentList();
  }

  state: {
    components: {name:string, value:string}[],
    selectedComponentId?: string,
  }

  async getComponentList() {
    const results = await postMessagePromise(
      MessageRequest.getComponentList
    ) as any;
    if (
      results &&
      results.components &&
      results.components.length > 0
    ) {
      this.setState({
        components: results.components,
        selectedComponentId: results.components[0].value,
      });
    }
  }

  getCompToken(): DSysComponentToken | undefined {
    if (
      this.props.tokenGroup &&
      this.props.tokenGroup.tokensets &&
      this.props.tokenGroup.tokensets.length > 0
    ) {
      const tokenSet = this.props.tokenGroup.tokensets[0];
      const token = tokenSet['component'] as DSysComponentToken;
      return token;
    }
    return undefined;
  }

  render() { 

    const token = this.getCompToken();
    console.log('token', token);

    return (<>
      <Select
        label="Component"
        value={token ? token['$value'] : this.state.selectedComponentId}
        onChange={(value: string) => {
          /* this.setState({
            selectedComponentId: value,
          })*/
        }}
        dropdown={this.state.components} />
    </>);
  }
}