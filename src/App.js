import React, { Component, Fragment } from "react";
// import gql from "graphql-tag";
// import { Mutation } from "react-apollo";
// Components
import Header from "./Components/Design/Header";
// Context
import WithApp from "./Context-hoc/WithApp";
// Design
import { notification, message } from "antd";

// Graphql
// const uploadFileMutation = gql`
//   mutation($file: Upload!) {
//   }
// `;

class App extends Component {
  state = {
    MusicPage: true,
  };

  render() {
    const { MusicPage } = this.state;

    return (
      <Fragment>
        <Header
          MusicPage={MusicPage}
          ChangeMusicPage={(bool) => this.setState({ MusicPage: bool })}
          mode404={false}
        />
      </Fragment>
    );
  }
}

export default WithApp(App);
