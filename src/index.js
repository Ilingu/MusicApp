// Module
import React from "react";
import ReactDOM from "react-dom";
// Components
import App from "./App";
// Context
import AppProvider from "./Context-hoc/AppProvider";
// CSS
// PWA
import * as serviceWorker from "./serviceWorker";

const WrappedAppProvider = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

ReactDOM.render(<WrappedAppProvider />, document.getElementById("root"));

serviceWorker.unregister();
