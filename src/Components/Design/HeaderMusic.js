import React from "react";
// Design
import { Button } from "react-bootstrap";
import { Dropdown, Menu } from "antd";

const HeaderMusic = ({
  ImgUrl,
  name,
  nbMusic,
  TpsTotal,
  title,
  author,
  volume,
  time,
  fn,
}) => {
  const menu = (
    <Menu>
      <Menu.Item>
        <Button variant="primary" block onClick={fn[1]}>
          <span className="fas fa-play"></span> Lecture
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button variant="success" block onClick={fn[0]}>
          <span className="fas fa-plus"></span> 🎵
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button variant="info" block onClick={fn[2]}>
          <span className="fas fa-edit"></span>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button variant="danger" block onClick={fn[3]}>
          <span className="fas fa-trash"></span>
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <header>
      <div className="info">
        <img src={ImgUrl} alt="Playlist" />
        <div className="infoWritten">
          <h2>{name}</h2>
          <div className="inlineWritten">
            <ul>
              <li>{nbMusic} Morçeaux</li>
              <li>{TpsTotal}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="PlayNow">
        {/* title */}
        {/* author */}
        {/* Volume */}
        {/* Repeat */}
        {/* Temps sur total de la music (progressBar) */}
      </div>
      <div className="action">
        <Button className="BouttonPerso" variant="light">
          Aléatoire <span className="fas fa-random"></span>
        </Button>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button className="BouttonPerso" variant="light">
            <span className="fas fa-caret-down"></span>
          </Button>
        </Dropdown>
      </div>
    </header>
  );
};

export default HeaderMusic;
