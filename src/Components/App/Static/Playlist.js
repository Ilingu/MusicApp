import React, { Component, Fragment } from "react";
import axios from "axios";
// Components
import Header from "../../Design/HeaderMusic";
import Song from "../Dyna/Song";
// Context
import AppContext from "../../../Context/AppContext";
// Fn
import { apiCall } from "../../../includes/fonctions";
// Design
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { Menu, Dropdown, Modal as MDCD, message, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = MDCD;

class Playlist extends Component {
  static contextType = AppContext;

  state = {
    PlaylistInfoSave: null,
    noPlaylist: false,
    Play: false,
    Method: 1,
    // Form
    YTURL: "",
    File: {},
    titleMusic: "",
    nameArtist: "",
    IsGoodForRequest: false,
    // Modal
    ModalChooseMethod: false,
    ModalAddMusic: false,
  };

  GetMusicInfo = async (url) => (await axios.get(url)).data;

  remplaceString = (str, remplace) => {
    return str.split(remplace[0]).join(remplace[1]);
  };

  SubmitMusic = async (event) => {
    event.preventDefault();
    const { Method, File, YTURL, titleMusic, nameArtist } = this.state;

    if (
      Method === 1 &&
      (YTURL.split("/")[0] === "http:" || YTURL.split("/")[0] === "https:") &&
      YTURL.split("/")[2] === "www.youtube.com" &&
      YTURL.split("/")[3] !== undefined &&
      YTURL.split("/")[3] !== "" &&
      titleMusic &&
      typeof titleMusic === "string" &&
      titleMusic.trim().length !== 0 &&
      titleMusic !== "" &&
      nameArtist &&
      typeof nameArtist === "string" &&
      nameArtist.trim().length !== 0 &&
      nameArtist !== ""
    ) {
      const { PlaylistInfoSave } = this.state;
      let ImageRoute = null;
      let IsGood = true;
      let MusicInfo = await this.GetMusicInfo(
        `https://theaudiodb.com/api/v1/json/1/searchtrack.php?s=${this.remplaceString(
          nameArtist.toLowerCase(),
          [" ", "%20"]
        )}&t=${titleMusic.toLowerCase()}`
      );
      if (MusicInfo.track === null)
        MusicInfo = await this.GetMusicInfo(
          `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${nameArtist}`
        );

      ImageRoute = MusicInfo.track || MusicInfo.artists;
      if (!ImageRoute) IsGood = false;

      message.success(
        "Processus enclenchée: Ne vous inquiété pas l'enregistrement d'une musique est assez long (jusqu'à 3min, au délas de ce temps il y a une erreur)",
        7
      );

      apiCall(
        "/Playlist/addMusic",
        "POST",
        {
          idPlaylist: PlaylistInfoSave._id,
          ImageUrl: IsGood
            ? ImageRoute[0][
                MusicInfo.track ? "strTrackThumb" : "strArtistThumb"
              ]
            : null,
          title: titleMusic,
          author: nameArtist,
          method: ["ytdl", YTURL],
        },
        (result) => {
          if (result === false) {
            notification["error"]({
              message: "Erreur Music non ajouté",
              description:
                "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
            });
            return;
          }
          this.context.refresh();
          message.success(`Votre music a bien enregistrée !`, 3);
        }
      );
    } else if (
      Method === 2 &&
      File !== {} &&
      typeof titleMusic === "string" &&
      titleMusic.trim().length !== 0 &&
      titleMusic !== "" &&
      typeof nameArtist === "string" &&
      nameArtist.trim().length !== 0 &&
      nameArtist !== ""
    ) {
      const { PlaylistInfoSave } = this.state;
      let formData = new FormData();
      let ImageRoute = null;
      let IsGood = true;
      let MusicInfo = await this.GetMusicInfo(
        `https://theaudiodb.com/api/v1/json/1/searchtrack.php?s=${this.remplaceString(
          nameArtist.toLowerCase(),
          [" ", "%20"]
        )}&t=${titleMusic.toLowerCase()}`
      );
      if (MusicInfo.track === null)
        MusicInfo = await this.GetMusicInfo(
          `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${nameArtist}`
        );

      ImageRoute = MusicInfo.track || MusicInfo.artists;
      if (!ImageRoute) IsGood = false;

      // FormData
      formData.set("idPlaylist", PlaylistInfoSave._id);
      formData.set("title", titleMusic);
      formData.set("author", nameArtist);
      formData.set(
        "ImageUrl",
        IsGood
          ? ImageRoute[0][MusicInfo.track ? "strTrackThumb" : "strArtistThumb"]
          : null
      );
      formData.append("FileAudio", File);

      apiCall(
        "/Playlist/addMusic",
        "POST",
        formData,
        (result) => {
          if (result === false) {
            notification["error"]({
              message: "Erreur Music non ajouté",
              description:
                "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
            });
            return;
          }
          this.context.refresh();
          message.success(`Votre music a bien enregistrée !`, 3);
        },
        {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        }
      );
    } else {
      notification["error"]({
        message: "Error",
        description:
          "Tous les champs doivent être remplie est correctement. (pour youtube l'url doit se présenter comme telle: https://www.youtube.com/<ID Video>)",
      });
    }
    this.CloseModal();
  };

  Play = (id) => {
    if (this.context.state.musicPart.now === null) {
      this.context.GetMusicFile(id, this.props.ActivePlaylist);
    }
  };

  edit = () => {};

  delete = () => {};

  showDeleteConfirm = () => {
    confirm({
      title: `Êtes-vous sûre de vouloir suprimmer ${
        this.context.state.AllMusicInfo.filter(
          (PlaylistObj) => PlaylistObj._id === this.props.ActivePlaylist
        )[0].name
      }`,
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: this.delete,
    });
  };

  CloseModal = () => {
    this.setState({
      ModalChooseMethod: false,
      ModalAddMusic: false,
      titleMusic: "",
      File: {},
      nameArtist: "",
      YTURL: "",
    });
  };

  Spinning = () => {
    let Spinners = [];
    let colors = ["danger", "info", "warning", "primary", "secondary", "dark"];
    for (let i = 0; i < 6; i++) {
      Spinners = [
        colors[i] === "danger" ? (
          <Spinner key={i} animation="border" variant={colors[i]} />
        ) : (
          <Spinner key={i} animation="border" variant={colors[i]}>
            <span>{Spinners}</span>
          </Spinner>
        ),
      ];
    }
    return Spinners;
  };

  timeoutSpinning = setTimeout(() => this.setState({ noPlaylist: true }), 3000);

  render() {
    const {
      PlaylistInfoSave,
      noPlaylist,
      ModalChooseMethod,
      ModalAddMusic,
      Method,
      titleMusic,
      nameArtist,
      YTURL,
    } = this.state;
    const { ActivePlaylist } = this.props;
    const { AllMusicInfo } = this.context.state;

    let MusicList = null;
    const PlaylistInfo = AllMusicInfo.filter(
      (PlaylistObj) => PlaylistObj._id === ActivePlaylist
    )[0];

    if (PlaylistInfo && PlaylistInfo !== PlaylistInfoSave) {
      this.setState({ PlaylistInfoSave: PlaylistInfo });
    }

    if (
      PlaylistInfo &&
      PlaylistInfo.MusicInside &&
      PlaylistInfo.MusicInside.length > 0
    ) {
      MusicList = PlaylistInfo.MusicInside.map((data, i) => (
        <Song
          key={i}
          id={data.dbFilename}
          title={data.title}
          author={data.author}
          imageUrl={data.ImageUrl}
          PlayMusic={(id) => this.Play(id)}
          AllMusicInfo={AllMusicInfo}
          ActivePlaylist={ActivePlaylist}
        />
      ));
    }

    if (AllMusicInfo.length) {
      clearTimeout(this.timeoutSpinning);
      const overlay = (
        <Menu>
          {AllMusicInfo.map((data, i) => (
            <Menu.Item
              key={i}
              onClick={() =>
                ActivePlaylist === data._id
                  ? this.props.newActive("")
                  : this.props.newActive(data._id)
              }
            >
              {data.name}
            </Menu.Item>
          ))}
        </Menu>
      );
      return (
        <aside
          id="PlaylistWithMusic"
          className={
            ActivePlaylist === "" ||
            !PlaylistInfo.MusicInside ||
            !PlaylistInfo.MusicInside.length
              ? "non-selection"
              : ""
          }
          style={{ width: `${window.innerWidth - this.props.proportion[0]}px` }}
        >
          {ActivePlaylist === "" ? (
            <Dropdown overlay={overlay}>
              <span>Veuillez Selectionez une playlist</span>
            </Dropdown>
          ) : (
            <Fragment>
              <Header
                ImgUrl={PlaylistInfo.ImageURL}
                name={PlaylistInfo.name}
                nbMusic={PlaylistInfo.MusicInside.length}
                TpsTotal="En Travaux"
                fn={[
                  () => this.setState({ ModalChooseMethod: true }),
                  () => {
                    this.setState({ Play: true });
                    this.Play();
                  },
                  this.edit,
                  this.showDeleteConfirm,
                ]}
              />
              <div id="containerMusicList">
                {!PlaylistInfo.MusicInside ||
                !PlaylistInfo.MusicInside.length ? (
                  <span
                    onClick={() => this.setState({ ModalChooseMethod: true })}
                  >
                    Aucune musique dans {PlaylistInfo.name}
                  </span>
                ) : (
                  MusicList
                )}
              </div>
            </Fragment>
          )}

          <Modal
            className="Modal"
            show={ModalChooseMethod}
            onHide={this.CloseModal}
          >
            <Modal.Header className="ModalH" closeButton>
              <Modal.Title>Choisie comment ajouter ta music</Modal.Title>
            </Modal.Header>
            <Modal.Body id="Choose" className="ModalB">
              {["Url Youtube", "Depuis un fichier (mp3...)"].map((txt, i) => (
                <Fragment key={i}>
                  <Button
                    variant="secondary"
                    block
                    onClick={() =>
                      this.setState({
                        ModalAddMusic: true,
                        ModalChooseMethod: false,
                        Method: i + 1,
                      })
                    }
                  >
                    {txt}
                  </Button>
                  {i === 1 ? null : "OU"}
                </Fragment>
              ))}
            </Modal.Body>
            <Modal.Footer className="ModalF">
              <Button variant="secondary" onClick={this.CloseModal}>
                Annuler
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            className="Modal"
            show={ModalAddMusic}
            onHide={this.CloseModal}
          >
            <Modal.Header className="ModalH" closeButton>
              <Modal.Title>
                {Method === 1 ? "Music par URL YT" : "Depuis un fichier"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="ModalB">
              <Form onSubmit={this.SubmitMusic}>
                {Method === 1 ? (
                  <Form.Group controlId="yturl">
                    <Form.Label>L'URL Youtube liée à la musique</Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      value={YTURL}
                      onChange={(event) =>
                        this.setState({ YTURL: event.target.value })
                      }
                      placeholder="L'url, ex: https://www.youtube.com/watch?v=MtN1YnoL46Q"
                    />
                    <Form.Label>Nom de la Musique</Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      value={titleMusic}
                      onChange={(event) =>
                        this.setState({ titleMusic: event.target.value })
                      }
                      placeholder="Thriller"
                    />
                    <Form.Label>Nom de l'artiste</Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      value={nameArtist}
                      onChange={(event) =>
                        this.setState({ nameArtist: event.target.value })
                      }
                      placeholder="Michael Jackson"
                    />
                    <Form.Text className="text-muted">
                      L'URL doit obligatoirement venir de Youtube (ex:
                      https://www.youtube.com/watch?v=MtN1YnoL46Q)
                    </Form.Text>
                  </Form.Group>
                ) : (
                  <Form.Group>
                    <label htmlFor="audioFile">Choose file to upload</label>
                    <br />
                    <input
                      type="file"
                      onChange={(event) => {
                        this.setState({
                          File: event.target.files[0],
                          titleMusic: event.target.files[0].name.split(".")[0],
                        });
                        message.success(
                          `The File ${event.target.files[0].name} has been saved correcty,`,
                          5
                        );
                        message.info(
                          "Maintenant qu'il est sauvegardé, tu peux faire autres choses et ajouter ce morceaux après",
                          9
                        );
                      }}
                      id="audioFile"
                      accept=".mp3, .wav"
                    />
                    <br />
                    <Form.Label>Nom de la Musique</Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      value={titleMusic}
                      onChange={(event) =>
                        this.setState({ titleMusic: event.target.value })
                      }
                      placeholder="Thriller"
                    />
                    <Form.Label>Nom de l'artiste</Form.Label>
                    <Form.Control
                      type="text"
                      autoComplete="off"
                      value={nameArtist}
                      onChange={(event) =>
                        this.setState({ nameArtist: event.target.value })
                      }
                      placeholder="Michael Jackson"
                    />
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer className="ModalF">
              <Button variant="secondary" onClick={this.CloseModal}>
                Annuler
              </Button>
              <Button variant="success" onClick={this.SubmitMusic}>
                <span className="fas fa-plus"></span> Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </aside>
      );
    } else if (!AllMusicInfo.length) {
      return (
        <aside
          id="PlaylistWithMusic"
          className="Spinner"
          style={{
            width: `${window.innerWidth - this.props.proportion[0]}px`,
          }}
        >
          {noPlaylist ? (
            <span onClick={this.props.onClickNewP}>
              Vous n'avez pas de Playlist, créez en une !
            </span>
          ) : (
            this.Spinning()
          )}
        </aside>
      );
    }
  }
}

export default Playlist;
