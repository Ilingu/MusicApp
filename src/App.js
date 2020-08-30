import React, { Component } from "react";
// import gql from "graphql-tag";
// import { Mutation } from "react-apollo";
// Context
import WithApp from "./Context-hoc/WithApp";
// Design
import { Button, Alert } from "react-bootstrap";

// Graphql
// const uploadFileMutation = gql`
//   mutation($file: Upload!) {
//   }
// `;

class App extends Component {
  state = {
    AlertsParams: [null, null],
  };

  render() {
    return <div></div>;
  }
}

export default WithApp(App);
