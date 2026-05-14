
import { useParams, useSearchParams } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import { createSocketConnection } from "../../../helpers/socket";
import { useSelector } from "react-redux";
import axios from "axios";

const Chat = () => {
  const params = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user  = useSelector((store)=> store.user);
  const userID = user?._id;
  const targetUserId = params.userId; 


  const fetchChatMessages = async () => {
    const chat = await axios.get("http://localhost:3000/chat/" + targetUserId, {
      withCredentials: true,
    });

    console.log(chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { senderId, message } = msg;
      return {
        firstName: senderId?.first_name,
        lastName: senderId?.last_name,
        message,
      };
    });
    setMessages(chatMessages);
  };


  useEffect(() => {
    fetchChatMessages();
  }, []);


  useEffect( () => {

    if(!userID) return;

    const socket = createSocketConnection();

    socket.emit("joinChat", {
      firstName : user.first_name, 
      userID, 
      targetUserId
    });

    socket.on("receivedMessage", ({firstName, lastName, message})=> {
      console.log(firstName + " " + message);
      setMessages((prevMessages)=>[...prevMessages, {firstName, lastName, message}])
    })

    // close the conenections
    return () => {
      socket.disconnect();  
    }
  
  }, [userID,targetUserId]);

  const sendMessage = () => {
    if(newMessage.trim() === "") return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName : user.first_name,
      lastName: user.last_name,
      userID,
      targetUserId,
      message: newMessage});
  };

  return (  
  <div>
    <p>hello chat {params.userId} </p>
  <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              className={
                "chat " +
                (user.first_name === msg.firstName ? "chat-end" : "chat-start")
              }
            >
              <div className="chat-header">
                {`${msg.firstName} ${msg.lastName}`}
                <time className="text-xs opacity-50"> 2 hours ago</time>
              </div>
              <div className="chat-bubble">{msg.message}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-500 text-black rounded p-2"
        ></input>
        <button onClick={sendMessage} className="btn btn-secondary">  
          Send
        </button>
      </div>
    </div>

  </div>
  );
};

export default Chat;