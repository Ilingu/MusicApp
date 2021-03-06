// Module
import React from "react";
import { Link } from "react-router-dom";
// Components
import Header from "../Components/Design/Header";
// CSS
import "../CSS/NotFound.css";

const NotFound = () => {
  window.addEventListener("mousemove", (event) => {
    let x = -event.clientX / 5,
      y = -event.clientY / 5;

    try {
      const ContainerElem = document.getElementById("container404").style;
      ContainerElem.backgroundPositionX = `${x}px`;
      ContainerElem.backgroundPositionY = `${y}px`;
    } catch {}
  });

  return (
    <div id="fakebody">
      <Header mode404={true} />
      <div
        id="container404"
        style={{ background: "url('Img/p404.png'), #151729" }}
      >
        <div className="content404">
          <h2>404</h2>
          <h4>
            <span role="img" aria-label="music-emoji">
              🎵
            </span>{" "}
            Opps! Page not found{" "}
            <span role="img" aria-label="music-emoji">
              🎵
            </span>
          </h4>
          <p>
            La page que vouis cherchiez n'existe pas. Vous devez avoir fait une
            faute dans l'url ou la page a été supprimer... .
          </p>
          <Link
            to="/"
            onClick={() =>
              window.removeEventListener("mousemove", () => null, true)
            }
          >
            Back To Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
