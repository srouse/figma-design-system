import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as mixpanel from './utils/mixpanel';

mixpanel.init(
  '3d003b51a03e6fc63ec569726a86dc1a',
  {
    disable_cookie: true,
    disable_persistence: true,
  }
);

ReactDOM.render(<App />, document.getElementById("root"));
