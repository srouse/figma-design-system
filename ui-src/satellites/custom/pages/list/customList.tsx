import React from "react";
import {
  cleanAndSortTokens,
  colors,
  CoreProps,
  getIcon,
  Icons,
} from "../../../../../shared";
import DragAndDropList from "../../../../components/DragAndDropList/dragAndDropList";
import Input from "../../../../components/Input";
import ListHeader from "../../../../components/ListHeader/ListHeader";
import { DSysCustomToken } from "../../../../../shared/types/designSystemTypes";
import "./customList.css";
import { addCustomToken } from "../../utils/addCustomToken";
import updateCustomToken from "../../utils/updateCustomToken";
import { changeCustomOrder } from "../../utils/changeCustomOrder";
import deleteCustomToken from "../../utils/deleteCustomToken";
import * as mixpanel from '../../../../utils/mixpanel';

export default class CustomList extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
    this.state = {
      isDeleting: false,
    };
    mixpanel.track(`list-${props.tokenGroup?.type}`,
      {name: props.tokenGroup?.name}
    );
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
          title="Custom Tokens"
          onAdd={() =>{
            addCustomToken(
              this.props.tokenGroup,
              this.props.updateTokenGroup,
            );
            mixpanel.track(`add-${this.props.tokenGroup?.type}`);
          }}
          onDelete={() => {
            this.setState({
              isDeleting: !this.state.isDeleting
            });
            mixpanel.track(`delete-${this.props.tokenGroup?.type}`);
          }}
          onDeleteClose={() => {
            this.setState({
              isDeleting: false
            });
          }} />
        <div className="dsys-list-body scroll-bar">
        <DragAndDropList
            rowHeight={48}
            onChange={(
              rowIndex: number,
              dropIndex: number
            ) => {
              changeCustomOrder(
                rowIndex, dropIndex,
                this.props.tokenGroup,
                this.props.updateTokenGroup,
              );
              mixpanel.track(`reorder-${this.props.tokenGroup?.type}`);
            }}
            rowList={tokens}
            rowGenerator={(
              tokenInfo, index,
              onMouseDownCapture,
              onMouseUpCapture,
            ) => {
              const prop = tokenInfo[0];
              const customToken = tokenInfo[1] as DSysCustomToken;
              return (
                <div
                  className="dsys-row"
                  key={`color-${customToken.$extensions['dsys.uid']}`}
                  data-key={`color-${customToken.$extensions['dsys.uid']}`}>
                  <div className="dsys-row-dragger"
                    dangerouslySetInnerHTML={{ __html: 
                      getIcon(Icons.drag, colors.greyLight) 
                    }}
                    onMouseDown={onMouseDownCapture}
                    onMouseUp={onMouseUpCapture}>
                  </div>
                  <div className="
                    dsys-row-name
                    custom-row-name">
                    <Input
                      hideLabel hideBorder
                      label="property"
                      value={prop}
                      onEnterOrBlur={(newName: string) => {
                        updateCustomToken(
                          {
                            ...customToken,
                            $extensions: {
                              ...customToken.$extensions,
                              "dsys.name": newName,
                            }
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                      }} />
                  </div>
                  <div className="custom-row-size">
                    <Input
                      label="size" 
                      hideLabel hideBorder
                      type="text"
                      value={`${customToken.$value}`}
                      onEnterOrBlur={(value: string) => {
                        updateCustomToken(
                          {
                            ...customToken,
                            $value: value,
                          },
                          this.props.tokenGroup,
                          this.props.updateTokenGroup,
                        );
                      }} />
                  </div>
                  <div className="dsys-row-deleting"
                    onClick={() => {
                      if (this.state.isDeleting) {
                        if (!this.props.tokenGroup) return;
                        deleteCustomToken(
                          customToken,
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