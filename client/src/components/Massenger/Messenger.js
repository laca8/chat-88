import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import User from "../user/User";
import Conversation from "../Conversation/Conversation";
import Message from "../Message/Message";
import io from "socket.io-client";
import cors from "cors";
const Messenger = () => {
  const history = useHistory();
  const [conversations, setConversation] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [users, setUsers] = useState([]);
  const scrollRef = useRef();
  const socket = useRef();
  const user = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const ENDPOINT = "http://localhost:8900";

  useEffect(() => {
    socket.current = io(ENDPOINT, {
      cors: {
        origin: "http://localhost:8900",
        credentials: true,
      },
      transports: ["websocket"],
    });

    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`/api/conversation/${user._id}`);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      //console.log(users);
    });
  }, [user]);
  useEffect(() => {
    axios.get("/api/user").then((res) => {
      setUsers(res.data.filter((a) => a.email !== user.email));
    });
  }, [user]);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/api/message/${currentChat?._id}`);

        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/api/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
      io.on("laca", (data) => {
        console.log(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder="Search for friends" className="chatMenuInput" />
          <h5>Conversations</h5>
          {conversations.map((conversation) => (
            <div
              onClick={() => setCurrentChat(conversation)}
              key={conversation._id}
            >
              <Conversation conversation={conversation} currentUser={user} />
            </div>
          ))}
          <hr />
          <h5>All Users</h5>
          {users.map((user) => (
            <User currentUser={user} key={user._id} />
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m, i) => (
                  <div ref={scrollRef} key={i}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something...."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                ></textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversation">
              Open a conversation to start chat.
            </span>
          )}
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          <h2>Chat Online</h2>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
