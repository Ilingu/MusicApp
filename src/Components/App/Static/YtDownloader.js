import React, { useState, Fragment } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
// Desing
import { Form, Button } from "react-bootstrap";
import { notification, Spin } from "antd";

const GETYTMusicFile = gql`
  query FileYT($url: String!) {
    FileYT(url: $url)
  }
`;

const YtDownloader = () => {
  // State
  const [YTURL, setYTURL] = useState("");
  const [OnDownload, setDownload] = useState(false);
  const [OnFinished, setFinished] = useState(false);
  const [Base64, setBase64] = useState("");
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
        "Vueillez patienter un peu le temps de téléchargement de la vidéo et de son convertissage en format mp3 (selon la taille ça durera plus ou moins longtemps, en tant normal ça dure environ entre 15s et 1min 30s)",
    });
  };

  // const make_download = (base64) => {
  //   var new_file = URL.createObjectURL(base64);

  //   var download_link = document.getElementById("download_link");
  //   download_link.href = new_file;
  //   var name = "IncraYTDownloader.mp3";
  //   download_link.download = name;
  // };

  // Render
  return (
    <section id="YTLD">
      <header>
        <h1>Youtube Url Downloader</h1>
        <h4>Mettez une URL Youtube pour télécharger le son de cette vidéo</h4>
      </header>

      <div id="contentYTLD">
        {OnFinished ? (
          <Fragment>
            <audio controls src={Base64}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
            <a href={Base64}>Télécharger</a>
          </Fragment>
        ) : null}
        {OnDownload && !OnFinished ? (
          <Fragment>
            <Spin id="SpinYTDL" tip="Loading..." size="large"></Spin>
            <Query query={GETYTMusicFile} variables={{ url: YTURL }}>
              {({ loading, error, data }) => {
                if (loading) return null;
                if (error) return `Error! ${error}`;
                const buf = Buffer.from(data.FileYT).toString("base64");
                setBase64(`data:audio/mp3;base64,${buf}`);
                setFinished(true);
                return <div></div>;
              }}
            </Query>
          </Fragment>
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
