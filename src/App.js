import React, { Component } from "react";
// Components
import Header from "./Components/Design/Header";
import Music from "./Components/App/Static/Music";
// Context
import AppContext from "./Context/AppContext";
// Fn
import { GETMusic } from "./includes/fonctions";

class App extends Component {
  state = {
    MusicPage: true,
    // Les info de toute les music dans AllMusicInfo et quand cliker sur une on demande le mp3 et on le met dans musicPartNow
    AllMusicInfo: [],
    musicPartNow: {},
  };

  async componentDidMount() {
    this.setState({ AllMusicInfo: await GETMusic(this.props.client) });
  }

  refresh = (added) => this.setState({ AllMusicInfo: [added] });

  render() {
    const { MusicPage, AllMusicInfo, musicPartNow } = this.state;

    return (
      <AppContext.Provider
        value={{
          state: {
            AllMusicInfo,
            musicPartNow,
          },
          client: this.props.client,
          refresh: this.refresh,
        }}
      >
        <Header
          MusicPage={MusicPage}
          ChangeMusicPage={(bool) => this.setState({ MusicPage: bool })}
          mode404={false}
        />
        <Music />
      </AppContext.Provider>
    );
  }
}

export default App;
