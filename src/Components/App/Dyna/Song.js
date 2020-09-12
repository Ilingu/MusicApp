import React from "react";

const Song = ({ imageUrl, title, author, id, idLinkMp3 }) => {
  return (
    <div className="Song">
      <img src={imageUrl} alt="Music" />
      <span></span>
    </div>
  );
};

export default Song;
