import React, { Component } from "react";
import { openDB } from "idb";
// Components
import Header from "./Components/Design/Header";
import Music from "./Components/App/Static/Music";
import YtDownloader from "./Components/App/Static/YtDownloader";
// Context
import AppContext from "./Context/AppContext";
// Fn
import { apiCall } from "./includes/fonctions";
// Design
import { notification } from "antd";

class App extends Component {
  state = {
    MusicPage: true,
    AllMusicInfo: [],
    musicPart: {
      prev: null,
      now: null,
      next: null,
    },
  };

  componentDidMount() {
    apiCall("/Playlist/all", "GET", {}, (result) => {
      if (result === false) {
        notification["error"]({
          message: "Erreur Music non ajouté",
          description:
            "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
        });
        return;
      }
      this.setState({ AllMusicInfo: result });
    });
  }

  loadMusicFiles = async (spe, id = null) => {
    const db = await openDB("IncraMusic", 1);
    const store = db.transaction("MusicFile").objectStore("MusicFile");
    if (!spe) return await store.getAll();
    else return await store.get(id);
  };

  isMusicAlreadyStorage = async (id) => {
    const MusicFiles = await this.loadMusicFiles(false);
    console.log(MusicFiles);

    if (MusicFiles.length === 0) return false;
    let Exists = false;
    MusicFiles.forEach((MusicFile) => {
      if (MusicFile.id === id) {
        Exists = true;
      }
    });
    console.log(Exists);
    return Exists;
  };

  AddMusicFile = async (id, MusicFile) => {
    if (!(await this.isMusicAlreadyStorage(id))) {
      const db = await openDB("IncraMusic", 1);
      const store = db
        .transaction("MusicFile", "readwrite")
        .objectStore("MusicFile");
      store.add({
        id,
        MusicName: `IM-${id}`,
        MusicFile,
      });
    }
  };

  GetMusicFile = async (
    thisMusic,
    NextMusic,
    PrevMusic,
    thisPlaylist,
    next
  ) => {
    const MusicFile = { ...this.state.musicPart };

    new Promise(async (resolve, reject) => {
      if (!(await this.isMusicAlreadyStorage(thisMusic))) {
        apiCall(
          "/Playlist/GetMusicFile",
          "POST",
          { dbFilename: thisPlaylist.MusicInside[thisMusic].dbFilename },
          (result) => {
            if (result === false) {
              notification["error"]({
                message: "Erreur Music non ajouté",
                description:
                  "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
              });
              resolve();
            }
            MusicFile.now = result.Base64File.data;
            this.AddMusicFile(thisMusic, result.Base64File.data);
            this.setState({
              musicPart: MusicFile,
            });
            resolve();
          }
        );
      } else if (thisMusic !== false) {
        const SpeMusicFile = await this.loadMusicFiles(true, thisMusic);
        MusicFile.now = SpeMusicFile.MusicFile;
        this.setState({
          musicPart: MusicFile,
        });
        resolve();
      } else {
        MusicFile.now = null;
        this.setState({
          musicPart: MusicFile,
        });
        resolve();
      }
    })
      .then(
        () =>
          new Promise(async (resolve, reject) => {
            // Next Music
            if (
              NextMusic !== false &&
              !(await this.isMusicAlreadyStorage(NextMusic))
            ) {
              apiCall(
                "/Playlist/GetMusicFile",
                "POST",
                { dbFilename: thisPlaylist.MusicInside[NextMusic].dbFilename },
                (result) => {
                  if (result === false) {
                    notification["error"]({
                      message: "Erreur Music non ajouté",
                      description:
                        "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
                    });
                    resolve();
                  }
                  MusicFile.next = result.Base64File.data;
                  this.AddMusicFile(NextMusic, result.Base64File.data);
                  this.setState({
                    musicPart: MusicFile,
                  });
                  resolve();
                }
              );
            } else if (NextMusic !== false) {
              const SpeMusicFile = await this.loadMusicFiles(true, NextMusic);
              MusicFile.next = SpeMusicFile.MusicFile;
              this.setState({
                musicPart: MusicFile,
              });
              resolve();
            } else {
              MusicFile.next = null;
              this.setState({
                musicPart: MusicFile,
              });
              resolve();
            }
          })
      )
      .then(async () => {
        // Prev Music
        if (
          PrevMusic !== false &&
          !(await this.isMusicAlreadyStorage(PrevMusic))
        ) {
          apiCall(
            "/Playlist/GetMusicFile",
            "POST",
            {
              dbFilename: thisPlaylist.MusicInside[PrevMusic].dbFilename,
            },
            (result) => {
              if (result === false) {
                notification["error"]({
                  message: "Erreur Music non ajouté",
                  description:
                    "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
                });
                next();
                return;
              }
              MusicFile.prev = result.Base64File.data;
              this.AddMusicFile(PrevMusic, result.Base64File.data);
              this.setState({
                musicPart: MusicFile,
              });
              next();
            }
          );
        } else if (PrevMusic !== false) {
          const SpeMusicFile = await this.loadMusicFiles(true, PrevMusic);
          MusicFile.prev = SpeMusicFile.MusicFile;
          this.setState({
            musicPart: MusicFile,
          });
          next();
        } else {
          MusicFile.prev = null;
          this.setState({
            musicPart: MusicFile,
          });
          next();
        }
      });
  };
  refresh = () =>
    apiCall("/Playlist/all", "GET", {}, (result) => {
      if (result === false) {
        notification["error"]({
          message: "Erreur Music non ajouté",
          description:
            "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
        });
        return;
      }
      this.setState({ AllMusicInfo: result });
    });

  render() {
    const { MusicPage, AllMusicInfo, musicPart } = this.state;

    return (
      <AppContext.Provider
        value={{
          state: {
            AllMusicInfo,
            musicPart,
          },
          refresh: this.refresh,
          GetMusicFile: this.GetMusicFile,
        }}
      >
        <Header
          MusicPage={MusicPage}
          ChangeMusicPage={(bool) => this.setState({ MusicPage: bool })}
          mode404={false}
        />
        {MusicPage ? <Music /> : <YtDownloader />}
      </AppContext.Provider>
    );
  }
}

export default App;
