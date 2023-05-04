import React from "react";
import {
  CoreProps,
  MessageRequest,
  SelectDropDown,
} from "../../../../../shared";
import DTButton, { DTButtonColor } from "../../../../components/DTButton";
import Select from "../../../../components/Select";
import postMessagePromise from "../../../../utils/postMessagePromise";
import getComponentToken from "../../utils/getComponentToken";
import updateComponent from "../../utils/updateComponent";
import "./componentList.css";
import * as mixpanel from '../../../../utils/mixpanel';

export default class ComponentList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      components: []
    }
    this.getComponentList();
    mixpanel.track(`list-${props.tokenGroup?.type}`
    );
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
    return (
      <div className="component-list">
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
            });
            mixpanel.track(`update-${this.props.tokenGroup?.type}`,
              {
                name: valueObj?.name
              }
            );
            updateComponent(
              this.props.tokenGroup,
              valueObj,
              this.props.updateTokenGroup,
            );
          }}
          dropdown={
            this.state.components
          } />
        <div className="focus-box">
          <DTButton
            label="Find Component"
            className="focus-component-btn"
            color={DTButtonColor.primary}
            onClick={() => {
              postMessagePromise(
                MessageRequest.focusOnComponent,
              );
            }} />
          <DTButton
            label="Find Token"
            className="focus-component-btn"
            color={DTButtonColor.primary}
            onClick={() => {
              postMessagePromise(
                MessageRequest.focusOnComponentToken,
              );
            }} />
        </div>
        
      </div>
    );
  }
}