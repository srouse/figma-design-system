import React from "react";
import {
  CoreProps,
  DSysGroupType,
  DSysLevel,
  DSysComponentsTokenset,
  MessageRequest,
  DTTokenType,
  SelectDropDown,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import InputHeader from "../../../../components/InputHeader";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";

export default class ComponentsFirstRun extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      components: []
    }
    this.getComponentList();
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

  state: {
    components: SelectDropDown[],
    selectedComponentId?: string,
    selectedComponentObj?: SelectDropDown | undefined,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Component Token" />
        <Select
          label="Component"
          value={this.state.selectedComponentId}
          onChange={(value: string, valueObj: SelectDropDown | undefined) => {
            this.setState({
              selectedComponentId: value,
              selectedComponentObj: valueObj,
            })
          }}
          dropdown={this.state.components} />
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.state.selectedComponentObj) {
              postMessagePromise(
                MessageRequest.notify,
                {
                  message: 
                  `No component with the id ${this.state.selectedComponentId}`,
                  error: true,
                }
              )
              return;
            }
            
            if (!this.props.tokenGroup) return;
            // build an empty tokenset and tokengroup and let list build groups
            const tokenset: DSysComponentsTokenset = {
              $extensions: {
                'dsys.level': DSysLevel.tokenset,
                'dsys.type': DSysGroupType.ComponentSet,
                "dsys.name": this.state.selectedComponentObj.name,
                "dsys.nodeId": '?'
              },
              $description: 'a component token',
            }

            tokenset['component'] = {// easier to find...there is only one
              $extensions: {
                'dsys.level': DSysLevel.token,
                'dsys.name': this.state.selectedComponentObj.name,
                'dsys.index': 0, // needed for typing, but there is no sorting
              },
              $type: DTTokenType.component,
              $value: this.state.selectedComponentObj.value,
            };

            const finalTokenGroup = {
              ...this.props.tokenGroup,
              name: this.state.selectedComponentObj.name,
              tokensets: [tokenset]
            };
            this.props.updateTokenGroup(finalTokenGroup);
            this.props.refreshTokens();
          }}></DTButton>
      </div>
    );
  }
}
