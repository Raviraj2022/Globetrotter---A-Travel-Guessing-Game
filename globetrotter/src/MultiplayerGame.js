import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const MultiplayerGame = () => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("roomUpdate", (data) => {
      setPlayers(data.players);
      setMessage(data.message);
    });

    socket.on("correctGuess", (data) => {
      setMessage(data.message);
    });

    socket.on("incorrectGuess", (data) => {
      setMessage(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoinRoom = () => {
    if (username && roomId) {
      socket.emit("joinRoom", { username, roomId });
    }
  };

  const handleGuess = (guess, correctAnswer, funFact) => {
    socket.emit("guess", { guess, correctAnswer, roomId, funFact });
  };

  return (
    <div className="p-5">
      <h1>Globetrotter Multiplayer</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Game</button>

      <h3>Players in Room:</h3>
      <ul>
        {players.map((p, index) => (
          <li key={index}>{p.username}</li>
        ))}
      </ul>

      <button onClick={() => handleGuess("Paris", "Paris", "Eiffel Tower was almost removed!")}>
        Guess Paris
      </button>
      <button onClick={() => handleGuess("London", "Paris", "Eiffel Tower was almost removed!")}>
        Guess London
      </button>

      <p>{message}</p>
    </div>
  );
};

export default MultiplayerGame;
