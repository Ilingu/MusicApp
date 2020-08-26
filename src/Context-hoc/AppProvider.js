import React, { Component } from "react";
// Fn
import { GETMusic } from "../includes/fonctions";
// Context
import AppContext from "./AppContext";

class AppProvider extends Component {
  state = {
    // Les info de toute les music dans AllMusicInfo et quand cliker sur une on demande le mp3 et on le met dans musicPartNow
    AllMusicInfo: { lolita: "5648" },
    musicPartNow: {},
  };

  componentDidMount() {
    // Call
    this.setState({ AllMusicInfo: "d" });
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          state: this.state,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppProvider;
