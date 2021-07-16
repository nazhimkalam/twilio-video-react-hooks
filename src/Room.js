import React, { useEffect, useState } from "react";
import Participant from "./Participant";
import styled from "styled-components";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <Container>
      <div>
        <h2>Meeting with Nazhim Kalam</h2>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <section>
        {room ? (
          <div>
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              currentUser
            />
            {remoteParticipants}
          </div>
        ) : (
          ""
        )}
      </section>
    </Container>
  );
};

export default Room;

const Container = styled.div`
  /* border: 1px red solid; */
  display: flex;
  flex-direction: column;
  align-items: center;

  > div {
    /* border: 1px red solid; */
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    > h2 {
      /* text styling here */
      font-weight: normal;
      color: #852b2b;
      padding-left: 10px;
    }

    > button {
      background-color: #852b2b !important;
      color: white !important;
      padding: 10px 20px !important;
      text-transform: uppercase;
      margin-right: 10px;
      border-radius: 10px;
      cursor: pointer;
      outline: none;
      border-color: #852b2b;

      :hover {
        color: #852b2b !important;
        border-color: #852b2b;
        background-color: white !important;
      }
    }
  }
  > section > div {
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  @media screen and (max-width: 500px) {
    > div {
      flex-direction: column;
      > h2 {
        font-size: larger;
        font-weight: bold;
      }
      > button {
        padding: 8px 10px !important;
        font-size: small;
      }
    }
  }
`;
