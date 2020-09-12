import React from "react";
// Design
import { Button } from "react-bootstrap";

const HeaderMusic = ({ ImgUrl, name, nbMusic, TpsTotal, title, author }) => {
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
        <Button className="BouttonPerso" variant="light">
          <span className="fas fa-caret-down"></span>
        </Button>
      </div>
    </header>
  );
};

export default HeaderMusic;
