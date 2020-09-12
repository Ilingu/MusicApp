import React, { Component } from "react";
// Context
import WithApp from "../../../Context-hoc/WithApp";
// Design
import { Spinner } from "react-bootstrap";
import { Menu, Dropdown } from "antd";

class Playlist extends Component {
  state = {
    AllMusic: null,
  };

  render() {
    const { AllMusic } = this.state;
    const { ActivePlaylist } = this.props;

    if (ActivePlaylist === "") {
      const overlay = (
        <Menu>
          {this.props.context.state.AllMusicInfo.map((data, i) => (
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
          className="non-selection"
          style={{ width: `${window.innerWidth - this.props.proportion[0]}px` }}
        >
          <Dropdown overlay={overlay}>
            <span>Veuillez Selectionez une playlist</span>
          </Dropdown>
        </aside>
      );
    } else if (!AllMusic) {
      let Spinners = [];
      let colors = [
        "danger",
        "info",
        "warning",
        "primary",
        "secondary",
        "dark",
      ];
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
      return (
        <aside
          id="PlaylistWithMusic"
          className="Spinner"
          style={{ width: `${window.innerWidth - this.props.proportion[0]}px` }}
        >
          {Spinners}
        </aside>
      );
    } else {
      return (
        <aside
          id="PlaylistWithMusic"
          style={{ width: `${window.innerWidth - this.props.proportion[0]}px` }}
        ></aside>
      );
    }
  }
}

export default WithApp(Playlist);
