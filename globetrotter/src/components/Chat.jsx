import { useState, useEffect } from "react";

const Chat = ({ socket, roomId, username }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("chatMessage", ({ username, message }) => {
      setChat((prev) => [...prev, `${username}: ${message}`]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chatMessage", { roomId, username, message });
    setMessage(""); 
  };

  return (
    <div className="mt-4 w-full border-t pt-2 bg-gray-800 p-4 rounded">
      <h3 className="font-bold">Game Chat:</h3>
      <div className="h-40 overflow-y-auto border p-2">
        {chat.map((msg, index) => (
          <p key={index} className="text-sm">{msg}</p>
        ))}
      </div>

      <div className="flex mt-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded text-gray-200 bg-gray-700"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 p-2 rounded ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
