import React, { Component } from "react";
import axios from "axios";
// Context
import AppContext from "../../../Context/AppContext";
// Components
import Menu from "./MusicMenu";
import Playlist from "./Playlist";
// Fn
import { apiCall } from "../../../includes/fonctions";
// Design
import { notification } from "antd";

class Music extends Component {
  static contextType = AppContext;

  state = {
    proportion: JSON.parse(window.localStorage.getItem("Proportion")),
    active: "",
    newP: false,
  };

  saveProportion = (newVal) => {
    window.localStorage.setItem("Proportion", JSON.stringify(newVal));
    this.setState({
      proportion: JSON.parse(window.localStorage.getItem("Proportion")),
    });
  };

  GetRdaMemes = async () => {
    return (await axios.get("https://api.imgflip.com/get_memes")).data.data
      .memes[Math.round(Math.random() * 99)].url;
  };

  addPlaylist = async (name) => {
    if (
      !name ||
      typeof name !== "string" ||
      name.trim().length === 0 ||
      name === ""
    ) {
      notification["warning"]({
        message: "Impossible de créer la playlist",
        description: "Vueillez donner un nom à votre playlist.",
      });

      return false;
    } else {
      apiCall(
        "/Playlist/addPL",
        "POST",
        {
          name,
          ImageURL: await this.GetRdaMemes(),
        },
        () => {
          this.context.refresh();
          this.setState({ newP: false });
        }
      );

      return true;
    }
  };

  render() {
    const { proportion, newP, active } = this.state;

    if (
      !proportion ||
      !proportion[0] ||
      !proportion[1] ||
      !proportion[2] ||
      proportion[0] < 200 ||
      proportion[0] > 500 ||
      proportion[1] > 90 ||
      proportion[1] < 30 ||
      proportion[2] > 90 ||
      proportion[2] < 30
    ) {
      this.setState({ proportion: [200, 70, 30] });
      window.localStorage.setItem("Proportion", JSON.stringify([200, 70, 30]));
    }

    return (
      <section id="Music">
        <Menu
          proportion={!proportion ? [200, 70, 30] : proportion}
          saveProportion={this.saveProportion}
          onClickNewP={() => this.setState({ newP: true })}
          addPlaylist={this.addPlaylist}
          newActive={(id) => this.setState({ active: id })}
          ActivePlaylist={active}
          newP={newP}
        />
        <Playlist
          ActivePlaylist={active}
          onClickNewP={() => this.setState({ newP: true })}
          newActive={(id) => this.setState({ active: id })}
          proportion={!proportion ? [200, 70, 30] : proportion}
        />
      </section>
    );
  }
}

export default Music;
