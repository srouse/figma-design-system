import React from "react";
import { CoreProps, DSysComponentToken, MessageRequest, SelectDropDown } from "../../../../../shared";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";
import getComponentToken from "../../utils/getComponentToken";
import updateComponent from "../../utils/updateComponent";

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
    selectedComponentObj?: SelectDropDown | undefined,
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

  render() { 
    const token = getComponentToken(this.props.tokenGroup);
    return (<>
      <Select
        label="Component"
        value={
          token ?
            token['$value'] :
            this.state.selectedComponentId
        }
        onChange={(value: string, valueObj?: SelectDropDown | undefined) => {
          this.setState({
            selectedComponentId: value,
            selectedComponentObj: valueObj,
          })
          updateComponent(
            this.props.tokenGroup,
            valueObj,
            this.props.updateTokenGroup,
          );
        }}
        dropdown={
          this.state.components
        } />
    </>);
  }
}