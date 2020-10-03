import React, { useState } from "react";
import YoutubeMp3Downloader from "youtube-mp3-downloader";
// Desing
import { Form, Button } from "react-bootstrap";
import { Progress, notification } from "antd";

const YD = new YoutubeMp3Downloader({
  ffmpegPath: "/node_modules/ffmpeg",
  outputPath: "",
  youtubeVideoQuality: "highestaudio",
  queueParallelism: 2,
  progressTimeout: 2000,
  allowWebm: false,
});

const YtDownloader = () => {
  // State
  const [YTURL, setYTURL] = useState("");
  const [Progress, setProgress] = useState(0);
  const [OnDownload, setDownload] = useState(false);

  // App
  const checkURL = (url) => {
    if (
      typeof url === "string" &&
      (url.split("/")[0] === "http:" || url.split("/")[0] === "https:") &&
      url.split("/")[2] === "www.youtube.com" &&
      url.split("/")[3] !== undefined &&
      url.split("/")[3].includes("watch?v=") &&
      url.split("/")[3] !== ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const Download = (event) => {
    event.preventDefault();
    if (!checkURL(YTURL)) {
      notification["error"]({
        message: "Error",
        description:
          "Le champs doit être remplie est correctement (l'url doit se présenter comme telle: https://www.youtube.com/<ID Video>)",
      });
      setYTURL("");
      return;
    }

    setDownload(true);

    YD.download(YTURL.split("=")[1], "IncraYTDownloader.mp3");

    YD.on("finished", function (err, data) {
      console.log(JSON.stringify(data));
    });

    YD.on("error", function (error) {
      console.log(error);
    });

    YD.on("progress", function (progress) {
      console.log(JSON.stringify(progress));
    });
  };

  // Render
  return (
    <section id="YTLD">
      <header>
        <h1>Youtube Url Downloader</h1>
        <h4>Mettez une URL pour la télécharger</h4>
      </header>

      <div id="contentYTLD">
        {OnDownload ? null : (
          <Form onSubmit={Download}>
            <Form.Group controlId="yturl">
              <Form.Label>Votre URL Youtube</Form.Label>
              <Form.Control
                type="text"
                autoComplete="off"
                value={YTURL}
                onChange={(event) => setYTURL(event.target.value)}
                placeholder="L'url, ex: https://www.youtube.com/watch?v=MtN1YnoL46Q"
              />
              <Form.Text className="text-muted">
                L'URL doit obligatoirement venir de Youtube (ex:
                https://www.youtube.com/watch?v=MtN1YnoL46Q)
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </div>
    </section>
  );
};

export default YtDownloader;
