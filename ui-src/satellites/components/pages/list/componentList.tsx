import React from "react";
import {
  cleanAndSortTokens,
  CoreProps,
} from "../../../../../shared";
import ListHeaderMinimal from "../../../../components/ListHeader/ListHeaderMinimal";
import "./componentList.css";
// import { addBreakpointToken } from "../../utils/addBreakpointToken";
// import updateBreakpointToken from "../../utils/updateBreakpointToken";
// import { changeBreakpointOrder } from "../../utils/changeBreakpointOrder";
// import deleteBreakpointToken from "../../utils/deleteBreakpointToken";

export default class ComponentList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
    };
  }

  state : {
    isDeleting: boolean,
  }

  render() {
    if (!this.props.tokenGroup) return (<div>No Steps Found</div>);
    const tokenset = this.props.tokenGroup.tokensets[0];
    if (!tokenset) return (<div>No Steps Found</div>);
    // const tokens = cleanAndSortTokens(tokenset);

    return (<>
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeaderMinimal
          title="Component Token" />
        <div className="dsys-list-body scroll-bar">
         <div>hi ya</div>
        </div>
      </div>
    </>);
  }
}