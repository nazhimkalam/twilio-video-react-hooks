import React, { useState } from "react";


const Lobby = ({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
  connecting,
}) => {
 
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
        <h2>Updated Version 1.50</h2>
        </div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="field"
          value={username}
          onChange={handleUsernameChange}
          readOnly={connecting}
          required
        />
      </div>

      <div>
        <label htmlFor="room">Room name:</label>
        <input
          type="text"
          id="room"
          value={roomName}
          onChange={handleRoomNameChange}
          readOnly={connecting}
          required
        />
      </div>

      <button
        type="submit"
        style={{ backgroundColor: "brown" }}
        disabled={connecting}>
        {connecting ? "Connecting" : "Join"}
      </button>
    </form>
  );
};

export default Lobby;
