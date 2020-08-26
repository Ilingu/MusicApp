import React, { Component } from "react";
// Provider
import AppProvider from "./Context-hoc/AppProvider";

class App extends Component {
  render() {
    return <div></div>;
  }
}

export default (
  <AppProvider>
    <App />
  </AppProvider>
);
