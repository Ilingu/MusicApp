import React, { Component } from "react";
// Components
import Menu from "./MusicMenu";
import Playlist from "./Playlist";

class Music extends Component {
  state = {
    proportion: JSON.parse(window.localStorage.getItem("Proportion")),
  };

  saveProportion = (newVal) => {
    window.localStorage.setItem("Proportion", JSON.stringify(newVal));
    this.setState({
      proportion: JSON.parse(window.localStorage.getItem("Proportion")),
    });
  };

  render() {
    const { proportion } = this.state;

    if (!proportion) {
      this.setState({ proportion: [200, 70, 30] });
      window.localStorage.setItem("Proportion", JSON.stringify([200, 70, 30]));
    }

    return (
      <section id="Music">
        <Menu
          proportion={!proportion ? [200, 70, 30] : proportion}
          saveProportion={this.saveProportion}
        />
        <Playlist />
      </section>
    );
  }
}

export default Music;
