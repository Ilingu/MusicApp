import React, { Component, Fragment } from "react";
// Components
import Header from "./Components/Design/Header";
import Music from "./Components/App/Static/Music";
// Context
import WithApp from "./Context-hoc/WithApp";
// Design

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
        <Music />
      </Fragment>
    );
  }
}

export default WithApp(App);
