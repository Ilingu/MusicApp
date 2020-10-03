import React, { Component, Fragment } from "react";
import axios from "axios";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
// Components
import Header from "../../Design/HeaderMusic";
// Context
import AppContext from "../../../Context/AppContext";
// Design
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { Menu, Dropdown, Modal as MDCD, message, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { confirm } = MDCD;
// GraphQl
const ADD_MUSIC = gql`
  mutation addMusicInPL(
    $idPlaylist: String!
    $title: String!
    $idLinkToMp3: String!
    $author: String!
    $ImageUrl: String
  ) {
    addMusicInPL(
      idPlaylist: $idPlaylist
      title: $title
      idLinkToMp3: $idLinkToMp3
      author: $author
      ImageUrl: $ImageUrl
    ) {
      _id
      MusicInside
    }
  }
`;

const ADD_AUDIO = gql`
  mutation audioUpload($file: Upload) {
    addMusicInPL(file: $file) {
      _id
      MusicInside {
        _id
        idLinkToMp3
        title
        author
        ImageUrl
      }
    }
  }
`;

class Playlist extends Component {
  static contextType = AppContext;

  state = {
    PlaylistInfo: null,
    noPlaylist: false,
    Play: false,
    Method: 1,
    // Form
    YTURL: "",
    NameOfMusic: "",
    File: "",
    IsGoodForRequest: false,
    // Modal
    ModalChooseMethod: false,
    ModalAddMusic: false,
  };

  SubmitMusic = (event) => {
    event.preventDefault();
    const { Method, File, YTURL, NameOfMusic } = this.state;

    if (
      Method === 1 &&
      (YTURL.split("/")[0] === "http:" || YTURL.split("/")[0] === "https:") &&
      YTURL.split("/")[2] === "www.youtube.com" &&
      YTURL.split("/")[3] !== undefined &&
      YTURL.split("/")[3] !== ""
    ) {
    } else if (
      Method === 2 &&
      NameOfMusic !== undefined &&
      NameOfMusic !== null &&
      typeof NameOfMusic === "string" &&
      NameOfMusic.trim().length !== 0 &&
      NameOfMusic !== ""
    ) {
    } else if (Method === 3 && File.length === 1) {
    } else {
      notification["error"]({
        message: "Error",
        description:
          "Tous les champs doivent être remplie est correctement. (pour youtube l'url doit se présenter comme telle: https://www.youtube.com/<ID Video>)",
      });
    }
    this.CloseModal();
  };

  Play = () => {};

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
      noPlaylist,
      ModalChooseMethod,
      ModalAddMusic,
      Method,
      YTURL,
      NameOfMusic,
    } = this.state;
    const { ActivePlaylist } = this.props;
    const { AllMusicInfo } = this.context.state;

    const PlaylistInfo = AllMusicInfo.filter(
      (PlaylistObj) => PlaylistObj._id === ActivePlaylist
    )[0];

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
                  <span>Aucune(s) musique(s) dans {PlaylistInfo.name}</span>
                ) : null}
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
              {[
                "Url Youtube",
                "Rechercher par le nom",
                "Depuis un fichier (mp3...)",
              ].map((txt, i) => (
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
                  {i === 2 ? null : "OU"}
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
                {Method === 1
                  ? "Music par URL YT"
                  : Method === 2
                  ? "Recherche par le nom"
                  : "Depuis un fichier"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="ModalB">
              <Mutation mutation={ADD_MUSIC}>
                {(addMusicInPL, { data }) => (
                  <Form onSubmit={this.SubmitMusic}>
                    {Method === 1 ? (
                      <Form.Group controlId="yturl">
                        <Form.Label>Votre URL Youtube</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          value={YTURL}
                          onChange={(event) =>
                            this.setState({ YTURL: event.target.value })
                          }
                          placeholder="L'url, ex: https://www.youtube.com/watch?v=MtN1YnoL46Q"
                        />
                        <Form.Text className="text-muted">
                          L'URL doit obligatoirement venir de Youtube (ex:
                          https://www.youtube.com/watch?v=MtN1YnoL46Q)
                        </Form.Text>
                      </Form.Group>
                    ) : Method === 2 ? (
                      <Form.Group controlId="name">
                        <Form.Label>Nom de la musique</Form.Label>
                        <Form.Control
                          type="text"
                          autoComplete="off"
                          value={NameOfMusic}
                          onChange={(event) =>
                            this.setState({ NameOfMusic: event.target.value })
                          }
                          placeholder="Nom, ex: Thriller"
                        />
                        <Form.Text className="text-muted">
                          Pas de ponctuation, écrivez juste le nom de la musique
                          et rien d'autres
                        </Form.Text>
                      </Form.Group>
                    ) : (
                      <Mutation mutation={ADD_AUDIO}>
                        {(audioUpload, { data }) => (
                          <Form.Group>
                            <label htmlFor="audioFile">
                              Choose file to upload
                            </label>
                            <br />
                            <input
                              type="file"
                              onChange={(event) => {
                                this.setState({ File: event.target.files[0] });
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
                          </Form.Group>
                        )}
                      </Mutation>
                    )}
                  </Form>
                )}
              </Mutation>
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
