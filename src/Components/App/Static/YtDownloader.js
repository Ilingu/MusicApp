import React, { useState } from "react";
import toWav from "audiobuffer-to-wav";
import xhr from "xhr";
// Fn
import { apiCall } from "../../../includes/fonctions";
// Desing
import { Form, Button } from "react-bootstrap";
import { notification, Spin } from "antd";

const YtDownloader = () => {
  // State
  const [YTURL, setYTURL] = useState("");
  const [OnDownload, setDownload] = useState(false);
  const [OnFinished, setFinished] = useState(false);
  const [DataFile, setDataFile] = useState(new ArrayBuffer());
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

  const MakeDownload = (wav) => {
    var new_file = URL.createObjectURL(new Blob([wav], { type: "audio/wav" }));

    var download_link = document.getElementById("download_link");
    download_link.href = new_file;
    var name = "IncraYTDownloader.wav";
    download_link.download = name;
  };

  const Download = async (event) => {
    event.preventDefault();
    if (!checkURL(YTURL)) {
      notification["error"]({
        message: "Error",
        description:
          "Le champs doit être remplie est correctement, Attention au espace (l'url doit se présenter comme telle: https://www.youtube.com/<ID Video>)",
      });
      // reset
      setYTURL("");
      return;
    }
    setDownload(true);
    notification["success"]({
      message: "Votre Requête a bien été envoyer",
      description:
        "Vueillez patienter un peu le temps de téléchargement de la vidéo et de son convertissage en format wav (selon la taille ça durera plus ou moins longtemps, en tant normal ça dure environ entre 15s et 1min 30s)",
    });
    apiCall("/Getfile", "POST", { url: YTURL }, (res) => {
      const BufferRes = res.FileMusic.data;
      setDataFile(BufferRes);
      setDownload(false);
      setYTURL("");
      setFinished(true);
    });
  };

  if (OnFinished) {
    const audioCtx = new (AudioContext || window.webkitAudioContext)();
    xhr(
      {
        uri: `data:audio/mp3;base64,${Buffer.from(DataFile).toString(
          "base64"
        )}`,
        responseType: "arraybuffer",
      },
      function (err, body, resp) {
        if (err) console.error(err);
        audioCtx.decodeAudioData(resp, function (buffer) {
          const wav = toWav(buffer);
          MakeDownload(wav);
        });
      }
    );
  }

  // Render
  return (
    <section id="YTLD">
      <header>
        <h1>Youtube Url Downloader</h1>
        <h4>Mettez une URL Youtube pour télécharger le son de cette vidéo</h4>
      </header>

      <div id="contentYTLD">
        {OnFinished ? (
          <div id="DownloadYTFile">
            <audio
              controls
              src={`data:audio/wav;base64,${Buffer.from(DataFile).toString(
                "base64"
              )}`}
            ></audio>
            <a
              href="/Home"
              onClick={() => {
                setFinished(false);
                setDataFile(new ArrayBuffer());
              }}
              id="download_link"
            >
              <span className="fas fa-download"></span> Télécharger
            </a>
            <Button
              variant="outline-primary"
              onClick={() => {
                setFinished(false);
                setDataFile(new ArrayBuffer());
              }}
            >
              <span className="fas fa-arrow-left"></span> Retour
            </Button>
          </div>
        ) : null}{" "}
        {OnDownload && !OnFinished ? (
          <Spin id="SpinYTDL" tip="Loading..." size="large"></Spin>
        ) : !OnDownload && !OnFinished ? (
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
        ) : null}
      </div>
    </section>
  );
};

export default YtDownloader;
