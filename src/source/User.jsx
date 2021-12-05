import React, { Fragment, PureComponent } from "react";
import { addVideoStream } from "./helper";
const Peer = window.Peer;
const Host = window.Host;

export default class User extends PureComponent {
  state = {
    screenHeight: window.innerHeight,
    stream: null,
    peer: null,
    call: null,
  };

  componentDidMount = () => {
    const peer = new Peer("321");
    this.setState({ peer });

    const myVideo = document.getElementById("myVideo");
    myVideo.muted = true;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideo, stream);
        this.setState({ stream });
        peer.on("open", (id) => {
          console.log("My peer ID is: " + id);
        });
      });

    peer.on("close", (id) => {
      console.log("My peer ID is (close): " + id);
    });
  };

  callAssistant = () => {
    const { peer, stream } = this.state;
    const call = peer.call("123", stream);
    this.setState({ call });
    const video = document.getElementById("assistantVideo");
    video.style.display = "inline-block";
    // video.muted = true;
    call.on("stream", (userVideoStream) => {
      console.log("userVideoStream", userVideoStream);
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      this.endCall();
    });
  };

  endCall = () => {
    const { call } = this.state;
    call.close();
    document.getElementById("assistantVideo").style.display = "none";
  };

  render() {
    const { screenHeight } = this.state;
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
              id="assistantVideo"
              className="rounded shadow w-100"
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="card w-100 fixed-bottom bg-dark">
          <div className="card-body text-center">
            <button
              className="btn btn-success btn-lg"
              onClick={this.callAssistant}
            >
              Start Call
            </button>{" "}
            <button className="btn btn-danger btn-lg" onClick={this.endCall}>
              End Call
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}
