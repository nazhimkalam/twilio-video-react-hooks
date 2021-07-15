import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import ReactPlayer from "react-player";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

const Participant = ({ participant, currentUser }) => {
  const [videoTracks, setVideoTracks] = useState([]);
  const [audioTracks, setAudioTracks] = useState([]);
  const [onMic, setonMic] = useState(true);
  const [onVideo, setonVideo] = useState(true);

  const videoRef = useRef();
  const audioRef = useRef();

  const onHandleToggleMic = () => {
    setonMic((onMic) => !onMic);
  };

  const onHandleToggleVideo = () => {
    setonVideo((onVideo) => {
      onVideo ? videoTracks[0].stop() : videoTracks[0].restart()
      return !onVideo;
    });
  };

  const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);

  useEffect(() => {
    setVideoTracks(trackpubsToTracks(participant.videoTracks));
    setAudioTracks(trackpubsToTracks(participant.audioTracks));

    const trackSubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => [...videoTracks, track]);
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => [...audioTracks, track]);
      }
    };

    const trackUnsubscribed = (track) => {
      if (track.kind === "video") {
        setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
      } else if (track.kind === "audio") {
        setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
      }
    };

    participant.on("trackSubscribed", trackSubscribed);
    participant.on("trackUnsubscribed", trackUnsubscribed);

    return () => {
      setVideoTracks([]);
      setAudioTracks([]);
      participant.removeAllListeners();
    };
  }, [participant]);

  useEffect(() => {
    const videoTrack = videoTracks[0];
    if (videoTrack) {
      videoTrack.attach(videoRef.current);
      return () => {
        videoTrack.detach();
      };
    }
  }, [videoTracks]);

  useEffect(() => {
    const audioTrack = audioTracks[0];
    if (audioTrack) {
      audioTrack.attach(audioRef.current);
      return () => {
        audioTrack.detach();
      };
    }
  }, [audioTracks]);

  return (
    <div className="participant">
      <h3>{participant.identity}</h3>
      <video ref={videoRef} />
      <audio ref={audioRef} muted={onMic ? true : false} />
      {currentUser && (
        <div style={{ border: "1px white solid" }}>
          <h2>Options</h2>
          <div>
            {/* <IconButton
        onClick={onHandleToggleMic}
        style={{ color: "white", backgroundColor: 'black', border: "1px white solid" }}>
        {!onMic ? <MicIcon /> : <MicOffIcon />}
      </IconButton> */}
            <br />
            <IconButton
              onClick={onHandleToggleVideo}
              style={{
                color: "white",
                backgroundColor: "black",
                border: "1px white solid",
              }}>
              {onVideo ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default Participant;
