import React from "react";
import { Button } from "react-bootstrap";
import { Dropdown, Menu } from "antd";

const Song = ({
  imageUrl,
  title,
  author,
  PlayMusic,
  id,
  AllMusicInfo,
  removeMusic,
  ActivePlaylist,
}) => {
  const menu2 = (
    <Menu>
      {AllMusicInfo.map((data, i) => {
        if (ActivePlaylist === data._id) {
          return null;
        }
        return <Menu.Item key={i}>{data.name}</Menu.Item>;
      })}
    </Menu>
  );
  const menu = (
    <Menu>
      <Menu.Item>
        <Button variant="primary" block onClick={() => PlayMusic(id)}>
          <span className="fas fa-play"></span> Jouer
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Dropdown overlay={menu2} placement="topCenter">
          <Button variant="info" block>
            Déplacer vers <span className="fas fa-caret-right"></span>
          </Button>
        </Dropdown>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Button variant="warning" block>
          <span className="fas fa-download"></span> Télécharger
        </Button>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <Button variant="danger" block onClick={removeMusic}>
          <span className="fas fa-trash"></span>
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="Song">
      <img src={imageUrl} alt="Music" />
      <div className="PlayMusic" onClick={() => PlayMusic(id)}>
        <span className="fas fa-play"></span>
      </div>
      <h3>{title}</h3>
      <h4>{author}</h4>
      <Dropdown
        overlay={menu}
        trigger={["contextMenu", "click"]}
        placement="bottomLeft"
      >
        <Button className="BouttonPerso" id="ActionMusic" variant="light">
          <span className="fas fa-bars"></span>
        </Button>
      </Dropdown>
    </div>
  );
};

export default Song;
