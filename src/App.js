import React, { Component, Fragment } from "react";
import { Receiver } from "react-file-uploader";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
// Context
import WithApp from "./Context-hoc/WithApp";
// Design
import { Button, Alert } from "react-bootstrap";

// Graphql
// const uploadFileMutation = gql`
//   mutation($file: Upload!) {

//   }
// `;

class App extends Component {
  state = {
    isReceiverOpen: false,
    Uploads: [],
    AlertsParams: [null, null],
  };

  Submit = async () => {
    const { Uploads } = this.state;

    if (Uploads && Uploads.length !== 0) {
    } else {
      this.setState({
        AlertsParams: ["Veuillez d'abord insérer le fichier", "danger"],
      });
      setTimeout(() => {
        this.setState({
          AlertsParams: [null, null],
        });
      }, 2000);
    }
  };

  render() {
    const { isReceiverOpen, AlertsParams } = this.state;
    return (
      <Fragment>
        {AlertsParams[0] && AlertsParams[1] ? (
          <Alert variant={AlertsParams[1]}>{AlertsParams[0]}</Alert>
        ) : null}
        <Receiver
          isOpen={isReceiverOpen}
          onDragEnter={() => this.setState({ isReceiverOpen: true })}
          onDragOver={(event) => console.log("Over")}
          onDragLeave={() => this.setState({ isReceiverOpen: false })}
          onFileDrop={(event, uploads) =>
            this.setState({
              Uploads: uploads,
              isReceiverOpen: false,
            })
          }
        >
          <div>visual layer of the receiver (drag & drop panel)</div>
        </Receiver>
        <br />
        <Button variant="success" onClick={this.Submit}>
          <span className="fas fa-upload"></span> Submit
        </Button>
      </Fragment>
    );
  }
}

export default WithApp(App);
