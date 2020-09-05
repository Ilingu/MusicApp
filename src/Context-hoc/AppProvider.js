import React, { Component } from "react";
import gql from "graphql-tag";
// Context
import AppContext from "./AppContext";

class AppProvider extends Component {
  state = {
    // Les info de toute les music dans AllMusicInfo et quand cliker sur une on demande le mp3 et on le met dans musicPartNow
    AllMusicInfo: [],
    musicPartNow: {},
  };

  componentDidMount() {
    this.props.client
      .query({
        query: gql`
          {
            playlists {
              _id
              name
            }
          }
        `,
      })
      .then(({ data }) => this.setState({ AllMusicInfo: data.playlists }));
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
