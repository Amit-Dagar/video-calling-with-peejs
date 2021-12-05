import React, { Fragment, PureComponent } from "react";
import { addVideoStream } from "./helper";
const Peer = window.Peer;
const Bootstrap = window.bootstrap;

export default class Assitant extends PureComponent {
  state = {
    screenHeight: window.innerHeight,
    call: null,
    stream: null,
  };

  componentDidMount = () => {
    const myVideo = document.getElementById("myVideo");
    myVideo.muted = true;

    const peer = new Peer("123");

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
        peer.on("open", (id) => {
          console.log("My peer ID is: " + id);
        });

        peer.on("call", (call) => {
          console.log("call");
          this.setState({ call, stream });
          const callModal = new Bootstrap.Modal(
            document.getElementById("callModal")
          );
          callModal.show();
        });
      });
  };

  acceptCall = () => {
    const { call, stream } = this.state;

    call.answer(stream);
    const video = document.getElementById("userVideo");
    video.style.display = "inline-block";

    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  endCall = () => {
    const { call } = this.state;
    call.close();
    document.getElementById("userVideo").style.display = "none";
  };

  render() {
    return (
      <Fragment>
        <div className="card bg-dark p-4">
          <div className="card-body text-center p-0">
            <video
              autoPlay
              playsInline
              id="myVideo"
              className="rounded shadow w-100"
            />
          </div>
          <div className="card-body p-0 text-center pt-3 w-100">
            <video
              autoPlay
              playsInline
              id="userVideo"
              className="rounded shadow w-100"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="card w-100 fixed-bottom bg-dark">
          <div className="card-body text-center">
            <button className="btn btn-danger btn-lg" onClick={this.endCall}>
              End Call
            </button>
          </div>
        </div>

        {/* call accept & reject modal */}
        <div className="modal" id="callModal" style={{ display: "none" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body text-center py-5">
                <button
                  className="btn btn-success btn-lg me-4"
                  onClick={this.acceptCall}
                  data-bs-dismiss="modal"
                >
                  Accept Call
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  data-bs-dismiss="modal"
                  onClick={() =>
                    this.setState({
                      call: null,
                      stream: null,
                    })
                  }
                >
                  Reject Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
