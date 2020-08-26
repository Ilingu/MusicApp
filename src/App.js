import React, { Component } from "react";
// Context
import WithApp from "./Context-hoc/WithApp";

class App extends Component {
  componentDidMount() {}
  render() {
    return <div></div>;
  }
}

export default WithApp(App);
