import React from "react";
import "./baseUI.css";
import {
  CoreProps,
  defaultTokenGroupCategorizedLookup,
  MessageRequest,
  TokenGroupCategorizedLookup,
  TokenGroupLookup
} from "../../shared/types/types";
import postMessagePromise from "../utils/postMessagePromise";
import DTButton, { DTButtonColor } from "../components/DTButton";
import { Icons } from "../../shared";

export default class BaseUI extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      categorizedTokenGroups: defaultTokenGroupCategorizedLookup,
      baseNodeId: '',
    }
    this.getCategorizedTokenGroups();
  }

  state: {
    categorizedTokenGroups: TokenGroupCategorizedLookup,
    baseNodeId: string,
  }

  async getCategorizedTokenGroups() {
    const results = await postMessagePromise(
      MessageRequest.getCategorizedTokenGroups
    ) as any;
    if (
      results &&
      results.categorizedTokenGroups
    ) {
      this.setState({
        categorizedTokenGroups: results.categorizedTokenGroups,
        baseNodeId: results.baseNodeId,
      });
    }
  }

  render() {
    return (<>
      <div
        className="dsys-list-body scroll-bar"
        style={this.props.style}>
        {renderRows(
          'Colors',
          this.state.categorizedTokenGroups.colors
        )}
        {renderRows(
          'Typography',
          this.state.categorizedTokenGroups.typography
        )}
        {renderRows(
          'Effects',
          this.state.categorizedTokenGroups.effects
        )}
        {renderRows(
          'Icons',
          this.state.categorizedTokenGroups.icons
        )}
        {renderRows(
          'Spacing',
          this.state.categorizedTokenGroups.spacing
        )}
        {renderRows(
          'Breakpoints',
          this.state.categorizedTokenGroups.breakpoints
        )}
        {renderRows(
          'Custom',
          this.state.categorizedTokenGroups.custom
        )}
        {renderRows(
          'Components',
          this.state.categorizedTokenGroups.components
        )}
        <div className="base-list-footer-padding"></div>
        <div className="base-nav">
          <DTButton
            label="Back To Index"
            color={DTButtonColor.primary}
            style={{width: '100%'}}
            icon={Icons.target}
            onClick={async () => {
              postMessagePromise(
                MessageRequest.focusOnToken,
                {
                  nodeId: this.state.baseNodeId,
                }
              );
            }}/>
        </div>
      </div>
    </>);
  }
}

function renderRows(
  title: string,
  tokenGroupLookups: TokenGroupLookup[],
) {
  return (
    <div className="base-group">
      <div className="dsys-row base-group-title">
        {title}
      </div>
      {tokenGroupLookups.length == 0 ? (
        <div className="dsys-row base-list-row base-no-tokensets">
          no {title.toLowerCase()} tokensets
        </div>
      ) : null}
      {tokenGroupLookups.map(tokenGroupLookup => {
        return (
          <div
            className="dsys-row base-list-row"
            key={`color-${tokenGroupLookup.nodeId}`}
            onClick={() => {
              postMessagePromise(
                MessageRequest.focusOnToken,
                {
                  nodeId: tokenGroupLookup.nodeId,
                }
              );
            }}>
            <div
              className="base-list-row-name">
              {tokenGroupLookup.tokenGroupName}
            </div>
          </div>
        );
      })}
    </div>
  );
}