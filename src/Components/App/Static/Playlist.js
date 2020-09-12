import React, { Component, Fragment } from "react";
// Components
import Header from "../../Design/HeaderMusic";
// Context
import AppContext from "../../../Context/AppContext";
// Design
import { Spinner } from "react-bootstrap";
import { Menu, Dropdown } from "antd";

class Playlist extends Component {
  static contextType = AppContext;

  state = {
    noPlaylist: false,
  };

  Spinning = () => {
    let Spinners = [];
    let colors = ["danger", "info", "warning", "primary", "secondary", "dark"];
    for (let i = 0; i < 6; i++) {
      Spinners = [
        colors[i] === "danger" ? (
          <Spinner key={i} animation="border" variant={colors[i]} />
        ) : (
          <Spinner key={i} animation="border" variant={colors[i]}>
            <span>{Spinners}</span>
          </Spinner>
        ),
      ];
    }
    return Spinners;
  };

  timeoutSpinning = setTimeout(() => this.setState({ noPlaylist: true }), 3000);

  render() {
    const { noPlaylist } = this.state;
    const { ActivePlaylist } = this.props;
    const { AllMusicInfo } = this.context.state;

    const PlaylistInfo = AllMusicInfo.filter(
      (PlaylistObj) => PlaylistObj._id === ActivePlaylist
    )[0];

    if (AllMusicInfo.length) {
      clearTimeout(this.timeoutSpinning);
      const overlay = (
        <Menu>
          {AllMusicInfo.map((data, i) => (
            <Menu.Item
              key={i}
              onClick={() =>
                this.props.ActivePlaylist === data._id
                  ? this.props.newActive("")
                  : this.props.newActive(data._id)
              }
            >
              {data.name}
            </Menu.Item>
          ))}
        </Menu>
      );
      return (
        <aside
          id="PlaylistWithMusic"
          className={
            ActivePlaylist === "" ||
            !PlaylistInfo.MusicInside ||
            !PlaylistInfo.MusicInside.length
              ? "non-selection"
              : ""
          }
          style={{ width: `${window.innerWidth - this.props.proportion[0]}px` }}
        >
          {ActivePlaylist === "" ? (
            <Dropdown overlay={overlay}>
              <span>Veuillez Selectionez une playlist</span>
            </Dropdown>
          ) : (
            <Fragment>
              <Header
                ImgUrl={PlaylistInfo.ImageURL}
                name={PlaylistInfo.name}
                nbMusic={PlaylistInfo.MusicInside.length}
                TpsTotal="En Travaux"
              />
              <div id="containerMusicList">
                {!PlaylistInfo.MusicInside ||
                !PlaylistInfo.MusicInside.length ? (
                  <span>Aucune(s) musique(s) dans {PlaylistInfo.name}</span>
                ) : null}
              </div>
            </Fragment>
          )}
        </aside>
      );
    } else if (!AllMusicInfo.length) {
      return (
        <aside
          id="PlaylistWithMusic"
          className="Spinner"
          style={{
            width: `${window.innerWidth - this.props.proportion[0]}px`,
          }}
        >
          {noPlaylist ? (
            <span onClick={this.props.onClickNewP}>
              Vous n'avez pas de Playlist, créez en une !
            </span>
          ) : (
            this.Spinning()
          )}
        </aside>
      );
    }
  }
}

export default Playlist;
