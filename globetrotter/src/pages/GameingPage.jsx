import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Lobby from "../components/Lobby.jsx";
import GamePlay from "../components/GamePlay";
import Chat from "../components/Chat";

const socket = io("http://localhost:5000", { transports: ["websocket"], withCredentials: true });

const GameingPage = ({ user }) => {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isInGame, setIsInGame] = useState(false);
  const [clue, setClue] = useState("");
  const [answerOptions, setAnswerOptions] = useState([]);
  const [destinationId, setDestinationId] = useState(null);
  const [score, setScore] = useState(0);
  const [inviter, setInviter] = useState(null);
  const [inviterScore, setInviterScore] = useState(null);

  const fetchQuestion = async () => {
    const res = await axios.get("http://localhost:5000/api/random-destination");
    setClue(res.data.clue);
    setAnswerOptions([...new Set(res.data.options)]);
    setDestinationId(res.data.destinationId);
  };

  const createGame = () => {
    setRoomId(username);
    setIsInGame(true);
  };

  const joinGame = () => {
    socket.emit("joinGame", { roomId, username });
    setIsInGame(true);
  };

//   console.log(username)
  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!isInGame ? (
        <Lobby {...{ username, setUsername, roomId, setRoomId, createGame, joinGame }} />
      ) : (
        <>
          <GamePlay {...{ user, clue, answerOptions, destinationId, score, setScore, fetchQuestion, inviter, inviterScore}} />
          <Chat {...{ socket, roomId, username }} />
        </>
      )}
    </div>
  );
};

export default GameingPage;
