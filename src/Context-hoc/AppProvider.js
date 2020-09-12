import React, { Component } from "react";
// Context
import AppContext from "./AppContext";
// Fn
import { GETMusic } from "../includes/fonctions";

class AppProvider extends Component {
  state = {
    // Les info de toute les music dans AllMusicInfo et quand cliker sur une on demande le mp3 et on le met dans musicPartNow
    AllMusicInfo: [],
    musicPartNow: {},
  };

  async componentDidMount() {
    this.setState({ AllMusicInfo: await GETMusic(this.props.client) });
  }

  refresh = (added) =>
    this.setState({ AllMusicInfo: [...this.state.AllMusicInfo, added] });

  render() {
    return (
      <AppContext.Provider
        value={{
          state: this.state,
          refresh: this.refresh,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
