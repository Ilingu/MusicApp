import React, { Component } from "react";
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
  GetMusicFile = (idNow, Playlist) => {
    const { musicPart, AllMusicInfo } = this.state;
    const MusicFile = { ...this.state.musicPart };
    const requestIndexedDB = window.indexedDB.open("MusicFileStorage", 3);
    requestIndexedDB.onsuccess = (event) => {
      this.db = event.target.result;
    };
    requestIndexedDB.onerror = (event) => {
      console.error("Erreur open");
    };
    const thisPlaylist = AllMusicInfo.filter((Pl) => Pl._id === Playlist)[0];
    const thisMusic = thisPlaylist.MusicInside.indexOf(
        AllMusicInfo.filter((Pl) => Pl._id === Playlist)[0].MusicInside.filter(
          (music) => music.dbFilename === idNow
        )[0]
      ),
      NextMusic =
        thisPlaylist.MusicInside[thisMusic + 1] !== undefined
          ? thisMusic + 1
          : false,
      PrevMusic = thisMusic - 1 < 0 ? false : thisMusic - 1;

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
          return;
        }
        // if (
        //   NextMusic !== false &&
        //   JSON.parse(window.localStorage.getItem(`MusicFile${Playlist}`))[
        //     `IM-${NextMusic}`
        //   ] === undefined
        // ) {
        //   apiCall(
        //     "/Playlist/GetMusicFile",
        //     "POST",
        //     { dbFilename: thisPlaylist.MusicInside[NextMusic].dbFilename },
        //     (result) => {
        //       if (result === false) {
        //         notification["error"]({
        //           message: "Erreur Music non ajouté",
        //           description:
        //             "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
        //         });
        //         return;
        //       }
        //       if (
        //         PrevMusic !== false &&
        //         JSON.parse(window.localStorage.getItem(`MusicFile${Playlist}`))[
        //           `IM-${PrevMusic}`
        //         ] === undefined
        //       ) {
        //         apiCall(
        //           "/Playlist/GetMusicFile",
        //           "POST",
        //           {
        //             dbFilename: thisPlaylist.MusicInside[PrevMusic].dbFilename,
        //           },
        //           (result) => {
        //             if (result === false) {
        //               notification["error"]({
        //                 message: "Erreur Music non ajouté",
        //                 description:
        //                   "Un problème à eu lieu lors de l'enregistrement de la Music (ce n'est pas de votre faute), vérifier votre connection et veuillez réessayer plus tard",
        //               });
        //               return;
        //             }
        //             MusicFile.prev = result.Base64File.data;
        //             this.setState({
        //               musicPart: MusicFile,
        //             });
        //             window.localStorage.setItem(
        //               `MusicFile${Playlist}`,
        //               JSON.stringify({
        //                 ...JSON.parse(
        //                   window.localStorage.getItem(`MusicFile${Playlist}`)
        //                 ),
        //                 [`IM-${PrevMusic}`]: result.Base64File.data,
        //               })
        //             );
        //           }
        //         );
        //       }
        //       MusicFile.next = result.Base64File.data;
        //       this.setState({
        //         musicPart: MusicFile,
        //       });
        //       window.localStorage.setItem(
        //         `MusicFile${Playlist}`,
        //         JSON.stringify({
        //           ...JSON.parse(
        //             window.localStorage.getItem(`MusicFile${Playlist}`)
        //           ),
        //           [`IM-${NextMusic}`]: result.Base64File.data,
        //         })
        //       );
        //     }
        //   );
        // }
        MusicFile.now = result.Base64File.data;
        this.setState({
          musicPart: MusicFile,
        });
        try {
          const transaction = this.db.transaction(`MusicFile${Playlist}`);
          const requestGET = transaction.objectStore(`IM-${thisMusic}`).get();
        } catch (err) {
          console.log(err);
        }
        // window.localStorage.setItem(
        //   `MusicFile${Playlist}`,
        //   JSON.stringify({
        //     ...JSON.parse(window.localStorage.getItem(`MusicFile${Playlist}`)),
        //     [`IM-${thisMusic}`]: result.Base64File.data,
        //   })
        // );
      }
    );
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
