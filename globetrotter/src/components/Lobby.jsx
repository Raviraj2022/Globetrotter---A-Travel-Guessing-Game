import { useState } from "react";

const Lobby = ({ username, setUsername, roomId, setRoomId, createGame, joinGame }) => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">Join or Create a Game</h1>

      <input
        type="text"
        placeholder="Enter username"
        className="p-2 border rounded text-gray-200 mb-2"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={createGame} className="bg-green-500 p-2 rounded mx-2">
        Create Game
      </button>

      <input
        type="text"
        placeholder="Enter Room ID"
        className="p-2 border rounded text-gray-200 mb-2"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinGame} className="bg-blue-500 p-2 rounded mx-2">
        Join Game
      </button>
    </div>
  );
};

export default Lobby;
