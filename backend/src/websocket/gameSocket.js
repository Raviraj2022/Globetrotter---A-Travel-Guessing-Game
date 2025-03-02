const setupGameSocket = (io) => {
    io.on("connection", (socket) => {
      console.log("Player connected:", socket.id);
  
      socket.on("joinGame", ({ roomId, username }) => {
        socket.join(roomId);
        io.to(roomId).emit("playerJoined", { username });
      });
  
      socket.on("submitAnswer", ({ roomId, username, answer }) => {
        io.to(roomId).emit("answerReceived", { username, answer });
      });
  
      socket.on("chatMessage", ({ roomId, username, message }) => {
        io.to(roomId).emit("chatMessage", { username, message });
      });
  
      socket.on("disconnect", () => {
        console.log("Player disconnected:", socket.id);
      });
    });
  };
  
  export default setupGameSocket;
  