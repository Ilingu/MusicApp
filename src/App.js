import React, { Component } from "react";
// Components
import Header from "./Components/Design/Header";
import Music from "./Components/App/Static/Music";
import YtDownloader from "./Components/App/Static/YtDownloader";
// Context
import AppContext from "./Context/AppContext";
// Fn
import { apiCall } from "./includes/fonctions";

class App extends Component {
  state = {
    MusicPage: true,
    // Les info de toute les music dans AllMusicInfo et quand cliker sur une on demande le mp3 et on le met dans musicPartNow
    AllMusicInfo: [],
    musicPartNow: {},
  };

  componentDidMount() {
    apiCall("/Playlist/all", "GET", {}, (result) => {
      if (result === false) return;
      this.setState({ AllMusicInfo: result });
    });
  }

  refresh = () =>
    apiCall("/Playlist/all", "GET", {}, (result) => {
      if (result === false) return;
      this.setState({ AllMusicInfo: result });
    });

  render() {
    const { MusicPage, AllMusicInfo, musicPartNow } = this.state;

    return (
      <AppContext.Provider
        value={{
          state: {
            AllMusicInfo,
            musicPartNow,
          },
          refresh: this.refresh,
        }}
      >
        <Header
          MusicPage={MusicPage}
          ChangeMusicPage={(bool) => this.setState({ MusicPage: bool })}
          mode404={false}
        />
        {MusicPage ? <Music /> : <YtDownloader />}
      </AppContext.Provider>
    );
  }
}

export default App;
