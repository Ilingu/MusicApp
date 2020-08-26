// Module
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Components
import App from "./App";
import NotFound from "./Error/NotFound";
// Context
import AppProvider from "./Context-hoc/AppProvider";
// CSS
import "./Assets/CSS/Index.css";
// PWA
import * as serviceWorker from "./serviceWorker";

const WrappedAppProvider = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={WrappedAppProvider} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();
