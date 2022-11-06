import React from "react";
import { cleanAndSortTokens, colors, CoreProps, DSysDimensionToken, getIcon, Icons, MessageRequest } from "../../../../../shared";
import DragAndDropList from "../../../../components/DragAndDropList/dragAndDropList";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import "./spacingList.css";
import updateSpacingToken from "../../utils/updateSpacingToken";
import { DSysSpacingToken } from "../../../../../shared/types/designSystemTypes";
import { addSpacingToken } from "../../utils/addSpacingToken";
import { changeSpacingOrder } from "../../utils/changeSpacingOrder";
import deleteSpacingToken from "../../utils/deleteSpacingToken";

export default class SpacingList extends React.Component<CoreProps> {

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
          title="Spacing Tokens"
          onAdd={() =>{
            addSpacingToken(
              this.props.tokenGroup,
              this.props.updateTokenGroup,
            );
          }}
          onDelete={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
          }} />
        <div className="dsys-list-body scroll-bar">
        <DragAndDropList
            rowHeight={48}
            onChange={(
              rowIndex: number,
              dropIndex: number
            ) => {
              changeSpacingOrder(
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
              const spacingToken = tokenInfo[1] as DSysSpacingToken;
              return (
                <div
                  className="dsys-row"
                  key={`color-${spacingToken.$extensions['dsys.uid']}`}
                  data-key={`color-${spacingToken.$extensions['dsys.uid']}`}>
                  <div className="dsys-row-dragger"
                    dangerouslySetInnerHTML={{ __html: 
                      getIcon(Icons.drag, colors.greyLight) 
                    }}
                    onMouseDown={onMouseDownCapture}
                    onMouseUp={onMouseUpCapture}>
                  </div>
                  <div className="
                    dsys-row-name
                    spacing-row-name">
                    <Input
                      hideLabel hideBorder
                      label="property"
                      value={prop}
                      onEnterOrBlur={(newName: string) => {
                        updateSpacingToken(
                          {
                            ...spacingToken,
                            $extensions: {
                              ...spacingToken.$extensions,
                              "dsys.name": newName,
                            }
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        )
                      }} />
                  </div>
                  <div className="spacing-row-size">
                    <Input
                      label="size" 
                      hideLabel hideBorder
                      type="number"
                      value={`${spacingToken.$value}`}
                      textAlign="right"
                      selectAllOnFocus={true}
                      onArrowUpOrDown={(
                        value: string,
                        increment: number
                      ) => {
                        updateSpacingToken(
                          {
                            ...spacingToken,
                            $value: Math.max(0, parseFloat(value) + increment)
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        )
                      }}
                      onEnterOrBlur={(value: string) => {
                        updateSpacingToken(
                          {
                            ...spacingToken,
                            $value: parseFloat(value),
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        )
                      }} />
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteSpacingToken(
                          spacingToken,
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