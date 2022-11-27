import { cssVariables } from "../../../../../utils/renderCssVariables";

export default `
  ${cssVariables()}

  body, html {
    margin: 0;
    padding: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  /* restults */
  .fontawesome-results {
    overflow-y: auto;
    font-family: var( --primary-ui-font );
    position: absolute;
    inset: 0;
  }

  .fontawesome-results::-webkit-scrollbar {
    width: 12px;
  }
   
  .fontawesome-results::-webkit-scrollbar-track {
    box-shadow: none;
  }
   
  .fontawesome-results::-webkit-scrollbar-thumb {
    background-color: var( --border-grey );
    border-radius: 6px;
    border: 3px solid white;
  }

  .fontawesome-results .no-results {
    font-size: 9px;
    color: var( --text-color );
    text-align: center;
    align-self: stretch;
  }

    .fontawesome-result {
      float: left;
      padding: 10px 4px;
      margin: 1px;
      width: 82px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      flex-direction: column;
    }

      .fontawesome-result:hover {
        cursor: pointer;
        background-color: var( --primary-lightest );
      }

      .fontawesome-result-icon {
        height: 40px;
        margin-bottom: 6px;
      }

        .fontawesome-result-icon svg {
          width: 40px; height: 40px;
        }

      .fontawesome-result .name {
        font-size: 9px;
        color: var( --text-color );
        text-overflow: ellipsis;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        align-self: stretch;
      }

      .fontawesome-result .style {
        font-size: 8px;
        color: var( --text-color );
        font-weight: bold;
        text-overflow: ellipsis;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        align-self: stretch;
      }`;