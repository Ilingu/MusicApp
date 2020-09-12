import React, { Component } from "react";
import axios from "axios";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
// Context
import AppContext from "../../../Context/AppContext";
// Design
import { Input } from "antd";
import { CheckOutlined } from "@ant-design/icons";

const { Search } = Input;
// Graphql

const ADD_PLAYLIST = gql`
  mutation AddPlaylist($name: String!, $ImageURL: String!) {
    addPlaylist(name: $name, ImageURL: $ImageURL) {
      _id
      name
      ImageURL
    }
  }
`;

class MusicMenu extends Component {
  static contextType = AppContext;

  resizeEl = () => {
    const resize_elR = document.querySelectorAll(".resize.R");
    const resize_elB = document.getElementById("resizeB");
    const MenuEl = document.getElementById("Menu");
    const PlaylistContainer = document.getElementById("PlaylistContainer");
    const SettingsEl = document.getElementById("settings");
    let m_pos;
    let d_pos;

    const resizeR = (e) => {
      let parent = [resize_elR[0].parentNode, resize_elR[1].parentNode];
      let dx = m_pos - e.x;
      m_pos = e.x;
      if (
        parseInt(getComputedStyle(parent[0], "").width) + -dx < 200 ||
        parseInt(getComputedStyle(parent[0], "").width) + -dx > 500
      )
        return;
      parent[0].style.width =
        parseInt(getComputedStyle(parent[0], "").width) + -dx + "px";
      parent[1].style.width =
        parseInt(getComputedStyle(parent[1], "").width) + -dx + "px";
    };
    const resizeB = (e) => {
      const HeightTotal = MenuEl.clientHeight;
      let parent = resize_elB.parentNode;
      let dx = d_pos - e.y;
      d_pos = e.y;
      const result =
        ((parseInt(getComputedStyle(parent, "").height) + -dx) / HeightTotal) *
        100;

      if (result > 90 || result < 30) return;

      parent.style.height = `${result}%`;
      SettingsEl.style.height = `${100 - result}%`;
    };

    resize_elR.forEach((Elr) => {
      Elr.addEventListener(
        "mousedown",
        function (e) {
          m_pos = e.x;
          document.addEventListener("mousemove", resizeR, false);
        },
        false
      );
    });
    resize_elB.addEventListener(
      "mousedown",
      function (e) {
        d_pos = e.y;
        document.addEventListener("mousemove", resizeB, false);
      },
      false
    );
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", resizeR, false);
        document.removeEventListener("mousemove", resizeB, false);
        this.props.saveProportion([
          PlaylistContainer.clientWidth,
          (PlaylistContainer.clientHeight / MenuEl.clientHeight) * 100,
          (SettingsEl.clientHeight / MenuEl.clientHeight) * 100,
        ]);
      },
      false
    );
  };

  GetRdaMemes = async () => {
    return (await axios.get("https://api.imgflip.com/get_memes")).data.data
      .memes[Math.round(Math.random() * 99)].url;
  };

  async componentDidMount() {
    this.resizeEl();
  }

  render() {
    const { AllMusicInfo } = this.context.state;

    const PlaylistJSX = AllMusicInfo.map((data, i) => (
      <div
        key={i}
        className={`Playlist bloc${
          this.props.ActivePlaylist === data._id ? " active" : ""
        }`}
        onClick={() =>
          this.props.ActivePlaylist === data._id
            ? this.props.newActive("")
            : this.props.newActive(data._id)
        }
      >
        {data.name}
      </div>
    ));

    return (
      <aside id="Menu" style={{ width: `${this.props.proportion[0]}px` }}>
        <div
          id="PlaylistContainer"
          style={{ height: `${this.props.proportion[1]}%` }}
        >
          {PlaylistJSX}

          {this.props.newP ? (
            <Mutation mutation={ADD_PLAYLIST}>
              {(addPlaylist, { data }) => (
                <Search
                  placeholder="Name Playlist"
                  onSearch={async (value) => {
                    if (this.props.addPlaylist(value)) {
                      const added = await addPlaylist({
                        variables: {
                          name: value,
                          ImageURL: await this.GetRdaMemes(),
                        },
                      });
                      this.context.refresh(added.data.addPlaylist);
                    }
                  }}
                  enterButton={<CheckOutlined />}
                  style={{ width: `${this.props.proportion[0]}px` }}
                />
              )}
            </Mutation>
          ) : null}
          <div id="resizeR" className="resize R"></div>
          <div id="resizeB" className="resize B"></div>
        </div>
        <div id="settings" style={{ height: `${this.props.proportion[2]}%` }}>
          <div id="resizeR2" className="resize R"></div>
          <div className="NewPlaylist bloc" onClick={this.props.onClickNewP}>
            <span className="fas fa-plus"></span> New Playlist
          </div>
          <div className="settings bloc">
            <span className="fas fa-cog fa-spin"></span> Paramètres
          </div>
        </div>
      </aside>
    );
  }
}

export default MusicMenu;
