import React from "react";
import {
  DSysColorToken,
  DSysTokenset,
} from "../../../../shared/types/designSystemTypes";
import { CoreProps } from "../../../../shared/types/types";
import Input from "../../../components/Input";
import "./editColor.css";
import cleanAndSortTokens from '../../../../shared/utils/cleanAndSortTokens';
import validColor, { returnValidColor } from '../../../../shared/utils/validColor';

export default class EditColor extends React.Component<CoreProps> {

  constructor(props: CoreProps | Readonly<CoreProps>) {
    super(props);
  }

  render() {
    return (
      <div className="edit-color scroll-bar">
        <table className="edit-color-table">
          {this.renderColorSteps()}
        </table>
      </div>
    );
  }

  renderColorSteps() {
    if (!this.props.tokenGroup) return (<div>No Steps Found</div>);

    // there will only ever be one in the array...
    const tokenset = this.props.tokenGroup.tokensets[0];
    if (!tokenset) return (<div>No Steps Found</div>);

    const tokens = cleanAndSortTokens(tokenset);

    const html = tokens.map((entry) => {
      const prop = entry[0];
      const value = entry[1] as DSysColorToken;
      const finalColor = returnValidColor(value.$value);
      return (
        <tr>
          <td className="edit-color-color-chip-td">
            <div className="edit-color-color-chip"
              style={{backgroundColor: `${finalColor}`}}>
              {validColor(value.$value) ? '' : (
                <div>!!</div>
              )}
            </div>
          </td>
          <td className="edit-color-step"
            style={{textAlign: 'center'}}>
            {prop}
          </td>
          <td>
            <Input
              className="edit-color-value-input"
              label="color" hideLabel
              value={`${value.$value}`}
              textAlign="right"
              onChange={(value: string) => {
                // find the token in the tokengroup
                if (!this.props.tokenGroup) return;
                const tokenset = this.props.tokenGroup.tokensets[0];
                if (!tokenset) return;
                const tokenEntry = Object.entries(tokenset).find(entry => {
                  return entry[0] === prop;
                });
                if (!tokenEntry) return;
                const token = tokenEntry[1];
                if (!token) return;

                const newToken: DSysColorToken = {
                  ...token,
                  $value: value,
                };
                const newTokenSet : DSysTokenset = {
                  ...tokenset
                };
                newTokenSet[prop] = newToken;
                // now weave back together...
                this.props.updateTokenGroup({
                  ...this.props.tokenGroup,
                  tokensets: [newTokenSet],
                });
              }} />
          </td>
        </tr>
      );
    });
    return html;

    return (<div>not yet</div>);
  }
}
