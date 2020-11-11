// Module
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// Components
import App from "./App";
import NotFound from "./Error/NotFound";
// CSS
import "./CSS/Index.css";
import "./CSS/Anim.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
// PWA
import * as serviceWorker from "./serviceWorker";

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);

// https://www.theaudiodb.com/api_guide.php

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.register();
