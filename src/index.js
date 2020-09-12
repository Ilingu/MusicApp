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
// CSS
import "./CSS/Index.css";
import "./CSS/Anim.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
// PWA
import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
  uri: "https://incra-api.glitch.me/graphql",
  link: createUploadLink({ uri: "https://incra-api.glitch.me/graphql" }),
  cache: new InMemoryCache(),
});

const WrappedAppProvider = () => (
  <ApolloProvider client={client}>
    <App client={client} />
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

// http://api.music-story.com/oauth/request_token?oauth_consumer_key=b630dc2fcc3852b15492c02b3a5a5617122c10f3&oauth_signature=chollet

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();
