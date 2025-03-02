import { useState } from "react";
import axios from "axios";

const GamePlay = ({ user, clue, answerOptions, destinationId, score, setScore, fetchQuestion, inviter, inviterScore}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");

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

        await axios.post("http://localhost:5000/api/score", {
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

  console.log(user.username)
  const shareInvite = async () => {
    try {
      const inviteLink = `http://localhost:5173/game?inviter=${user}&score=${score}`;
      const whatsappMessage = `Hey! I challenge you to play Globetrotter! 🌍 My score: ${score}
Play here: ${inviteLink}`;
      
      window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, "_blank");
    } catch (error) {
      console.error("Error generating invite link:", error);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Guess the Destination!</h1>

      {inviter && (
        <p className="text-lg my-2">
          You were invited by <b>{inviter}</b> (Score: {inviterScore})
        </p>
      )}

      <p className="text-lg my-4">{clue}</p>

      {answerOptions.map((option) => (
        <button
          key={option}
          onClick={() => submitAnswer(option)}
          disabled={selectedAnswer !== null}
          className={`p-2 rounded my-2 w-40 ${
            selectedAnswer === option
              ? correctAnswer === option
                ? "bg-green-500"
                : "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {option}
        </button>
      ))}

      {feedback && <p className="text-xl mt-4">{feedback}</p>}
      <h3 className="mt-4 text-xl">Your Score: {score}</h3>

      <button onClick={shareInvite} className="bg-green-500 p-2 rounded mt-4">
        Challenge a Friend
      </button>
    </div>
  );
};

export default GamePlay;
