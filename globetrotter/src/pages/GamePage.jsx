

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

const GamePage = ({ user }) => {
  const [clue, setClue] = useState("");
  const [answerOptions, setAnswerOptions] = useState([]);
  const [destinationId, setDestinationId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isInGame, setIsInGame] = useState(false);
  const [chat, setChat] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [inviter, setInviter] = useState(null);
  const [inviterScore, setInviterScore] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check for invite parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const invitedBy = urlParams.get("inviter");
    const inviterScore = urlParams.get("score");

    if (invitedBy) {
      setInviter(invitedBy);
      setInviterScore(inviterScore);
      setRoomId(invitedBy); // Use inviter's username as room ID
    }

    if (!isInGame) return;

    fetchQuestion();

    socket.on("playerJoined", ({ username }) => {
      console.log(`${username} joined the game!`);
      setChat((prev) => [...prev, `${username} joined the game`]);
    });

    socket.on("answerReceived", ({ username, answer }) => {
      setChat((prev) => [...prev, `${username}: ${answer}`]);
    });

    socket.on("chatMessage", ({ username, message }) => {
      console.log(username, message)
      setChat((prev) => [...prev, `${username}: ${message}`]);
    });
  

    return () => {
      socket.off("playerJoined");
      socket.off("answerReceived");
      socket.off("chatMessage");
    };
  }, [isInGame]);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/random-destination");
      setClue(res.data.clue);
      setAnswerOptions([...new Set(res.data.options)]);
      setDestinationId(res.data.destinationId);
      setFeedback(""); // Reset feedback
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const submitAnswer = async (selectedAnswer) => {
    try {
      setSelectedAnswer(selectedAnswer);
      const res = await axios.post("http://localhost:5000/api/game", {
        userId: user.id,
        destinationId,
        answer: selectedAnswer,
      });

      if (res.data.correct) {
        setFeedback("🎉 Correct!");
        setCorrectAnswer(selectedAnswer);
        setScore((prev) => prev + 10);

        // Save score to DB
        await axios.post(`http://localhost:5000/api/score`, {
          username: user.username,
          score: score + 10,
        });
      } else {
        setFeedback("😢 Incorrect!");
        setCorrectAnswer(null);
      }

      setTimeout(() => {
        fetchQuestion();
        setSelectedAnswer(null);
        setCorrectAnswer(null);
      }, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const createGame = async () => {
    if (!username.trim()) {
      alert("Please enter a username!");
      return;
    }
    setRoomId(username); // Use username as Room ID
    setIsInGame(true);
  };

  const shareInvite = async () => {
    try {
      const inviteLink = `http://localhost:5173/game?inviter=${username}&score=${score}`;
      const whatsappMessage = `Hey! I challenge you to play Globetrotter! 🌍 My score: ${score}
Play here: ${inviteLink}`;
      
      window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };

  const joinGame = () => {
    if (!username.trim() || !roomId.trim()) {
      alert("Please enter a username and Room ID!");
      return;
    }
    socket.emit("joinGame", { roomId, username });
    setIsInGame(true);
  };

  const sendMessage = () => {
    console.log("Hiii");
    if (!message.trim()) return; // Prevent empty messages
    socket.emit("chatMessage", { roomId, username, message });
    setMessage(""); // Clear input after sending
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!isInGame ? (
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
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold">Guess the Destination!</h1>
          
          {inviter && (
            <p className="text-lg my-2">You were invited by <b>{inviter}</b> (Score: {inviterScore})</p>
          )}

          <p className="text-lg my-4">{clue}</p>

          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => submitAnswer(option)}
              disabled={selectedAnswer !== null} // Disable after selecting
              className={`p-2 rounded my-2 w-40 
                ${
                  selectedAnswer === option
                    ? correctAnswer === option
                      ? "bg-green-500"
                      : "bg-red-500"
                    : "bg-blue-500"
                }`
              }
            >
              {option}
            </button>
          ))}

          {feedback && <p className="text-xl mt-4">{feedback}</p>}
          <h3 className="mt-4 text-xl">Your Score: {score}</h3>

          {/* WhatsApp Invite Button */}
          <button onClick={shareInvite} className="bg-green-500 p-2 rounded mt-4">
            Challenge a Friend
          </button>

          {/* Chat Section */}
          <div className="mt-4 w-full border-t pt-2 bg-gray-800 p-4 rounded">
            <h3 className="font-bold">Game Chat:</h3>
            {chat.map((msg, index) => (
              <p key={index} className="text-sm">{msg}</p>
            ))}
          </div>

           {/* Chat Input */}
  <div className="flex mt-2">
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-1 p-2 border rounded text-gray-200 bg-gray-700"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
    />
    <button onClick={sendMessage} className="bg-blue-500 p-2 rounded ml-2">
      Send
    </button>
  </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
