import React from "react";
// Design
import { Button } from "react-bootstrap";
import { Dropdown, Menu, Slider } from "antd";

const HeaderMusic = ({
  ImgUrl,
  name,
  nbMusic,
  TpsTotal,
  title,
  author,
  volume,
  time,
  paused,
  ISPlay,
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
        <Button variant="danger" block onClick={fn[2]}>
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
      {ISPlay ? (
        <div id="PlayNowParams">
          <h4>
            <span
              onClick={fn[4]}
              className={`fas ${paused ? "fa-play" : "fa-pause"}`}
            ></span>{" "}
            {title}
          </h4>
          <h6>{author}</h6>
          <div id="VolumeRange">
            <Slider
              min={0}
              max={1}
              onChange={(value) => fn[3](value)}
              value={typeof volume === "number" ? volume : 0}
              step={0.01}
            />
          </div>
          {/* Repeat */}
          {/* Temps sur total de la music (progressBar) */}
        </div>
      ) : null}
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
