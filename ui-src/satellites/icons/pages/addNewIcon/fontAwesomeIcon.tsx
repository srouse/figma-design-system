import React from "react";
import {
  CoreProps,
  getIcon,
  Icons,
} from "../../../../../shared";
import Input from "../../../../components/Input";
import Select from "../../../../components/Select";
import "./fontAwesomeIcon.css";

interface FontAwesomeIconProps extends CoreProps {
  onClose: () => void,
}

export default class FontAwesomeIcon extends React.Component<FontAwesomeIconProps> {

  constructor(props: FontAwesomeIconProps | Readonly<FontAwesomeIconProps>) {
    super(props);
    this.state = {
      addType: undefined,
      searchTerm: '',
      svgExample: '',
      searching: false,
      faResults: [],
      iconStyle: 'all',
    };
  }

  state: {
    addType: 'font-awesome' | 'upload' | undefined,
    searchTerm: string,
    svgExample: string,
    searching: boolean,
    faResults: any[],
    iconStyle: string,
  }

  searchCache: {[key:string]:any} = {};

  render() {
    return (
      <div className="font-awesome-icon">
        <div className="font-awesome-icon-body">
          <div
            className="close"
            onClick={() => this.props.onClose()}
            dangerouslySetInnerHTML={{__html:getIcon(Icons.close)}}>
          </div>
          <div className="header">Font Awesome Icon</div>
          <div className="search-fields">
            <Input
              label="" 
              value={this.state.searchTerm}
              placeholder="search"
              onEnterOrBlur={async (searchTerm: string) => {
                if (searchTerm === '') return;

                this.setState({
                  searchTerm,
                });

                if (!this.searchCache[searchTerm]) {
                  this.setState({
                    faResults: [],
                    searching: true,
                  });
                  fetch('https://api.fontawesome.com', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                    },
                    body: JSON.stringify({query: `
                      {
                        search(
                          version: "5.9.0",
                          query: "${searchTerm}",
                          first: 30
                        ) {
                          id
                          familyStylesByLicense {
                            free {
                              family
                              style
                            }
                            pro {
                              family
                              style
                            }
                          }
                        } 
                      }
                    `})
                  })
                    .then(r => r.json())
                    .then(result => {
                      console.log('result returned:', result);
                      this.searchCache[searchTerm] = result.data.search;
                      this.setState({
                        faResults: result.data.search,
                        searching: false,
                      });
                    });
                }else{
                  this.setState({
                    faResults: this.searchCache[searchTerm],
                    searching: false,
                  });
                }
              }} />
            <Select
              label=""
              className="typography-detail-font-family"
              value={this.state.iconStyle}
              dropdown={[
                {value:'all', name:'All Styles'},
                {value:'brands', name:'Brands'},
                {value:'solid', name:'Solid'},
                {value:'regular', name:'Regular'},
                {value:'light', name:'Light'},
                {value:'thin', name:'Thin'}
              ]}
              onChange={(value) => {
                this.setState({
                  iconStyle: value,
                });
              }} />
          </div>
          <div className="summary">
            {this.state.searching ? 
              'searching' : 
              this.state.faResults.length > 0 ? 
                `${this.state.faResults.length} results for ${this.state.searchTerm}` :
                ''
            }
          </div>
          <div className="fontawesome-results scroll-bar">
            {this.state.faResults.map((result) => {
              if (
                result.familyStylesByLicense &&
                result.familyStylesByLicense.pro
              ) {
                const pro = result.familyStylesByLicense.pro;
                return pro.map((proResult: { style: any; }) => {
                  if (
                    this.state.iconStyle === 'all' ||
                    this.state.iconStyle === proResult.style
                  ) {
                    return (
                      <div className="fontawesome-result"
                        key={`${proResult.style}-${result.id}`}>
                        <div className="fontawesome-result-icon"
                          dangerouslySetInnerHTML={{__html:`
                            <i class="fa-${proResult.style} fa-${result.id}"></i>
                          `}}></div>
                        <div className="name">{result.id}</div>
                        <div className="style">{proResult.style}</div>
                      </div>
                    );
                  }
                  return null;
                });
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}


