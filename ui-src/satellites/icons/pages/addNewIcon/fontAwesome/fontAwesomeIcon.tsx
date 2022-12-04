import React from "react";
import {
  CoreProps,
  getIcon,
  Icons,
} from "../../../../../../shared";
import Input from "../../../../../components/Input";
import Select from "../../../../../components/Select";
import "./fontAwesomeIcon.css";
import resultsCss from './fontAweseomIcon.css';
import searchFontAwesome from "./searchFontAwesome";
import findFontAwesomeKit, { FontAwesomeKit } from "./findFontAwesomeKit";
import FontAwesomeKitButton from "./kits/fontAwesomeKitButton";
import CreateIconConfirm from "../../createIconConfirm/createIconConfirm";

interface FontAwesomeIconProps extends CoreProps {
  onClose: () => void,
}

type FontAwesomeState = {
  addType: 'font-awesome' | 'upload' | undefined,
  searchTerm: string,
  svgExample: string,
  searching: boolean,
  faResults: any[],
  kit: FontAwesomeKit | undefined,
  fontAwesomeStyle: string,
  showIconConfirm: boolean,
  icon: {
    svg: string,
    name: string,
    style: string,
  } | undefined,
}

const FontAwesomeProStyles = [
  {value:'', name:'All Styles'},
  {value:'brands', name:'Brands'},
  {value:'solid', name:'Solid'},
  {value:'regular', name:'Regular'},
  {value:'light', name:'Light'},
  {value:'thin', name:'Thin'},
  {value:'sharp-solid', name:'Sharp Solid'},
];

const FontAwesomeFreeStyles = [
  {value:'', name:'All Styles'},
  {value:'brands', name:'Brands'},
  {value:'solid', name:'Solid'},
];

export default class FontAwesomeIcon
  extends React.Component<FontAwesomeIconProps>
{

  constructor(
    props: FontAwesomeIconProps | Readonly<FontAwesomeIconProps>
  ) {
    super(props);
    this.state = {
      addType: undefined,
      searchTerm: '',
      svgExample: '',
      searching: false,
      faResults: [],
      kit: undefined,
      fontAwesomeStyle: '',
      showIconConfirm: false,
      icon: undefined,
    };
    this.handleFontAwesomeClick = this.handleFontAwesomeClick.bind(this);
    window.addEventListener('message', this.handleFontAwesomeClick);
  }

  componentWillUnmount(): void {
    window.removeEventListener('message', this.handleFontAwesomeClick);
  }

  handleFontAwesomeClick(evt: Event) {
    const data = (evt as any).data as any;
    if (data.name === 'fontawesome-result') {
      this.setState({
        icon: data.icon,
        showIconConfirm: true,
      });
    }
  }

  state: FontAwesomeState;

  searchCache: {[key:string]:any} = {};

  async search(searchTerm: string) {
    this.setState({
      faResults: [],
      searching: true,
      searchTerm,
    });
    const kit = await findFontAwesomeKit(
      this.props.fontAwesomeApiKey,
      this.props.fontAwesomeKit,
      this.props.updateFontAwesomeKit
    );
    const results = await searchFontAwesome( searchTerm, kit );
    if (this.state.searchTerm === searchTerm) {
      this.setState({
        faResults: results,
        searching: false,
        kit
      });
    }
  }

  render() {
    if (this.state.showIconConfirm) {
      return <CreateIconConfirm
                {...this.props}
                onClose={this.props.onClose}
                icon={this.state.icon} />;
    }else{
      const searchResults = renderIconResults(this.state);
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
                onChange={async (searchTerm: string) => {
                  if (this.state.searchTerm !== searchTerm)
                    this.search( searchTerm );
                }} />
              <Select
                label=""
                className="typography-detail-font-family"
                value={this.state.fontAwesomeStyle}
                dropdown={
                  this.state.kit ? 
                    ((this.state.kit.licenseSelected === 'pro') ?
                      FontAwesomeProStyles : FontAwesomeFreeStyles) :
                    FontAwesomeFreeStyles
                }
                onChange={(value) => {
                  this.setState({
                    fontAwesomeStyle: value,
                  });
                }} />
            </div>
            <FontAwesomeKitButton
              fontAwesomeKit={this.props.fontAwesomeKit}
              fontAwesomeApiKey={this.props.fontAwesomeApiKey}
              updateFontAwesomeKit={this.props.updateFontAwesomeKit}
              updateFontAwesomeApiKey={this.props.updateFontAwesomeApiKey}
              onKitLoaded={(kit) => {
                this.setState({
                  kit, 
                  fontAwesomeStyle: '',
                });
                if (this.state.searchTerm)
                  setTimeout(() => this.search( this.state.searchTerm ), 0);
              }} />
            <div className="summary">
              {this.state.searching ? 
                'searching' : 
                this.state.faResults && this.state.faResults.length > 0 ? 
                  `${searchResults.totalIconStyles} icons for 
                    '${this.state.searchTerm}'` :
                  ''
              }
            </div>
            {!this.state.searching ? (
              <div className="fontawesome-results">
                <iframe
                  className="font-awesome-iframe"
                  tabIndex={-1}
                  srcDoc={`
                    <style>${resultsCss}</style>
                    <script
                      src="https://kit.fontawesome.com/${this.state.kit?.token}.js"
                      crossorigin="anonymous">
                    </script>
                    <div class="fontawesome-results">
                      ${searchResults.content}
                    </div>
                  `}>
                </iframe>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
  }
}

function renderIconResults(
  state: FontAwesomeState,
) {
  if (!state.faResults || state.faResults.length === 0) {
    return {
      content: '<div class="no-results">no icons found</div>',
      totalIconStyles: 0,
    };
  }
  let totalIconStyles = 0;
  const content = state.faResults.map((result) => {
    if (result.familyStylesByLicense) {
      const familyStyles = (result.familyStylesByLicense.pro) ?
        result.familyStylesByLicense.pro :
        result.familyStylesByLicense.free;
      if (familyStyles) {
        return familyStyles.map(
          (familyStyle: { style: any, family: string }
        ) => {
          if (familyStyle.family === 'classic') {
            if (
              state.fontAwesomeStyle === '' ||
              state.fontAwesomeStyle === familyStyle.style
            ) {
              totalIconStyles++;
              return renderIconString(
                familyStyle,
                result.id
              );
            }
          }else if (familyStyle.family === 'duotone') {
            // don't do anything till FDST can export correctly
          }else if (familyStyle.family === 'sharp') {
            if (
              state.fontAwesomeStyle === '' ||
              state.fontAwesomeStyle === 'sharp-solid'
            ) {
              totalIconStyles++;
              return renderIconString(
                familyStyle,
                result.id
              );
            }
          }
          return null;
        }).join('');
      }
    }
  });
  return {
    content: content.join(''),
    totalIconStyles,
  }
}

function renderIconString(
  familyStyle: { style: any, family: string },
  id:string
) {
  const displayStyle = familyStyle.family === 'classic' ?
    familyStyle.style : `${familyStyle.family}-${familyStyle.style}`;

  const identifier = `${familyStyle.family}-${familyStyle.style}-${id}`;
  return `
    <div class="fontawesome-result"
      id="${identifier}"
      key="${identifier}"
      onclick="
        const svg = this.querySelector('svg');
        if (svg) {
          window.parent.postMessage({
            name: 'fontawesome-result',
            icon: {
              svg: svg.outerHTML,
              name: '${id}',
              style: '${displayStyle}',
            }
          }, '*');
        }
      ">
      <div class="fontawesome-result-icon ">
        <i class="
          fa-${familyStyle.style} fa-${id}
          ${familyStyle.family === 'sharp' ? 'fa-sharp' : ''}"></i>
      </div>
      <div class="name">${id}</div>
      <div class="style">${displayStyle}</div>
    </div>
  `;
}

