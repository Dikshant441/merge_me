const socket = require("socket.io")

const initChatServer= (server)=> {
    const io = socket(server,{
        cors:{
            origin: "http://localhost:5173",
            credentials:true,
        }
    });
 
    io.on("connection", (socket)=> {
        socket.on("joinChat", ({userID, targetUserId}) => {
            const roomId = [userID, targetUserId].join("_");
            console.log(`User ${userID} joined room ${roomId}`);
            socket.join(roomId);
        });

        socket.on("sendMessage", ({senderId, receiverId, message}) => {});

        socket.on("disconnect", () => {});


    });
};

module.exports = initChatServer;