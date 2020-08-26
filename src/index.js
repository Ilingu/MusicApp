// Module
import React from "react";
import ReactDOM from "react-dom";
// Components
import App from "./App";
// CSS
// PWA
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();
