import React, { useState, useEffect, useRef } from "react";
import { IconButton } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import ReactPlayer from "react-player";
import styled from "styled-components";
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
    setonMic((onMic) => {
      onMic ? audioTracks[0].stop() : audioTracks[0].restart();
      return !onMic;
    });
  };

  const onHandleToggleVideo = () => {
    setonVideo((onVideo) => {
      onVideo ? videoTracks[0].stop() : videoTracks[0].restart();
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
    <Container>
      <h3>{participant.identity}</h3>
      <video ref={videoRef} />
      <audio ref={audioRef} />
      {currentUser && (
        <section>
          <IconButton
            onClick={onHandleToggleMic}
            style={{
              color: "white",
              backgroundColor: "black",
              border: "1px white solid",
            }}>
            {onMic ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          <IconButton
            onClick={onHandleToggleVideo}
            style={{
              color: "white",
              backgroundColor: "black",
              border: "1px white solid",
            }}>
            {onVideo ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </section>
      )}
    </Container>
  );
};

export default Participant;

const Container = styled.div`
  /* border: 1px red solid; */
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-items: center;

  > h3 {
    font-weight: normal;
  }

  > video {
    width: 100% !important;
    max-width: 600px;
    min-width: 250px;
    display: block;
    margin: 0 auto;
    border-radius: 6px;
  }

  > section {
    display: flex;
    width: 100%;
    margin: 10px;
    align-items: center;
    justify-content: center;
  }

  button {
    background-color: #852b2b !important;
    margin: 10px;
  }
`;
