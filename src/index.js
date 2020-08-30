// Module
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
// Components
import App from "./App";
import NotFound from "./Error/NotFound";
// Context
import AppProvider from "./Context-hoc/AppProvider";
// CSS
import "./Assets/CSS/Index.css";
import "bootstrap/dist/css/bootstrap.min.css";
// PWA
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  link: createUploadLink({ uri: "https://incra-api.glitch.me/graphql" }),
  cache: new InMemoryCache(),
});

const WrappedAppProvider = () => (
  <ApolloProvider client={client}>
    <AppProvider>
      <App />
    </AppProvider>
  </ApolloProvider>
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
