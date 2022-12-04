import React from "react";
import {
  cleanAndSortTokens,
  colors,
  CoreProps,
  getIcon,
  Icons,
  DSysBreakpointToken,
} from "../../../../../shared";
import DragAndDropList from "../../../../components/DragAndDropList/dragAndDropList";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import "./breakpointList.css";
import { addBreakpointToken } from "../../utils/addBreakpointToken";
import updateBreakpointToken from "../../utils/updateBreakpointToken";
import { changeBreakpointOrder } from "../../utils/changeBreakpointOrder";
import deleteBreakpointToken from "../../utils/deleteBreakpointToken";
import Select from "../../../../components/Select";

export default class BreakpointList extends React.Component<CoreProps> {

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
    const tokens = cleanAndSortTokens(tokenset);

    return (<>
      <div className={`
        dsys-list
        ${this.state.isDeleting ? 'is-deleting' : ''}`}>
        <ListHeader
          title="Breakpoint Tokens"
          onAdd={() =>{
            addBreakpointToken(
              this.props.tokenGroup,
              this.props.updateTokenGroup,
            );
          }}
          onDelete={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
          }}
          onDeleteClose={() => {
            this.setState({
              isDeleting: false
            });
          }} />
        <div className="dsys-list-body scroll-bar">
        {tokens && tokens.length === 0 ? (
          <div className="no-tokens">no tokens</div>
        ) : null}
        <DragAndDropList
            rowHeight={48}
            onChange={(
              rowIndex: number,
              dropIndex: number
            ) => {
              changeBreakpointOrder(
                rowIndex, dropIndex,
                this.props.tokenGroup,
                this.props.updateTokenGroup,
              );
            }}
            rowList={tokens}
            rowGenerator={(
              tokenInfo, index,
              onMouseDownCapture,
              onMouseUpCapture,
            ) => {
              const prop = tokenInfo[0];
              const breakpointToken = tokenInfo[1] as DSysBreakpointToken;
              return (
                <div
                  className="dsys-row"
                  key={`color-${breakpointToken.$extensions['dsys.uid']}`}
                  data-key={`color-${breakpointToken.$extensions['dsys.uid']}`}>
                  <div className="dsys-row-dragger"
                    dangerouslySetInnerHTML={{ __html: 
                      getIcon(Icons.drag, colors.greyLight) 
                    }}
                    onMouseDown={onMouseDownCapture}
                    onMouseUp={onMouseUpCapture}>
                  </div>
                  <div className="
                    dsys-row-name
                    breakpoint-row-name">
                    <Input
                      hideLabel hideBorder
                      label="property"
                      value={prop}
                      onEnterOrBlur={(newName: string) => {
                        updateBreakpointToken(
                          {
                            ...breakpointToken,
                            $extensions: {
                              ...breakpointToken.$extensions,
                              "dsys.name": newName,
                            }
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                      }} />
                  </div>
                  <div className="breakpoint-size-cell">
                    <Input
                      label="size" 
                      hideLabel hideBorder
                      type="number"
                      value={`${breakpointToken.$value}`}
                      textAlign="right"
                      selectAllOnFocus={true}
                      onArrowUpOrDown={(
                        value: string,
                        increment: number
                      ) => {
                        updateBreakpointToken(
                          {
                            ...breakpointToken,
                            $value: Math.max(0, parseInt(value) + increment)
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                      }}
                      onEnterOrBlur={(value: string) => {
                        updateBreakpointToken(
                          {
                            ...breakpointToken,
                            $value: parseInt(value),
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                      }} />
                  </div>
                  <div className="breakpoint-direction-cell">
                    <Select
                      label=" "
                      value={breakpointToken.$direction}
                      cellDisplay={true}
                      dropdown={[
                        {name:'up', value:'up'},
                        {name:'down', value:'down'},
                      ]}
                      onChange={(direction: string) => {
                        updateBreakpointToken(
                          {
                            ...breakpointToken,
                            $direction: direction as 'up' | 'down',
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        )
                      }}>
                    </Select>
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteBreakpointToken(
                          breakpointToken,
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                        setTimeout(() => {// need to wait a beat for refresh
                          this.setState({
                            isDeleting: false,
                          });
                        }, 300);
                      }
                    }}>
                    <div className="dsys-row-deleting-icon"
                      dangerouslySetInnerHTML={{ __html: 
                        getIcon(Icons.delete) 
                      }}></div>
                  </div>
                </div>
              );
            }}>
          </DragAndDropList>
        </div>
      </div>
    </>);
  }
}