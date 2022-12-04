import React from "react";
import {
  CoreProps,
  DSysGroupType,
  DSysLevel,
  DSysComponentsTokenset,
  MessageRequest,
  DTTokenType,
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
    components: {name:string, value:string}[],
    selectedComponentId?: string,
  }

  render() {
    return (
      <div className="first-run">
        <InputHeader
          label="Create Component Token" />
        {/* <Input
          label="Name"
          value={this.state.name}
          onEnterOrBlur={(name: string) => {
            this.setState({name});
          }} 
          validation={
            this.validator.register(
              'name',
              () => {
                return {
                  success: this.state.name ? true : false,
                  message: 'Name is required'
                }
              }
            )
          } /> */}
        <Select
          label="Component"
          value={this.state.selectedComponentId}
          onChange={(value: string) => {
            this.setState({
              selectedComponentId: value,
            })
          }}
          dropdown={this.state.components} />
        <div style={{flex: "1"}}></div>
        <DTButton
          label="Create"
          color={DTButtonColor.primary}
          onClick={() => {
            if (!this.state.selectedComponentId) {
              postMessagePromise(
                MessageRequest.notify,
                {message: 'No component selected', error: true}
              )
              return;
            }
            const comp = this.state.components.find(comp => {
              return comp.value === this.state.selectedComponentId;
            });
            if (!comp) {
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
                "dsys.name": comp.name,
                "dsys.nodeId": '?'
              },
              $description: 'a component token',
            }

            tokenset['component'] = {// easier to find...there is only one
              $extensions: {
                'dsys.level': DSysLevel.token,
                "dsys.name": comp.name,
              },
              $type: DTTokenType.component,
              $value: comp.value,
            };

            const finalTokenGroup = {
              ...this.props.tokenGroup,
              name: comp.name,
              tokensets: [tokenset]
            };
            this.props.updateTokenGroup(finalTokenGroup);
            this.props.refreshTokens();
          }}></DTButton>
      </div>
    );
  }
}
