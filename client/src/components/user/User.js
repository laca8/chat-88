import React from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const User = ({ currentUser }) => {
  const history = useHistory();
  const user = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const createConversations = async () => {
    const data = {
      senderId: user._id,
      recieverId: currentUser._id,
    };
    try {
      const res = await axios.post(`/api/conversation`, data);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="conversation" style={{ width: "100%" }}>
      <img className="conversationImg" src={currentUser?.profile} alt="" />
      <span className="conversationName">{currentUser?.name}</span>
      <button
        className="btn "
        style={{
          backgroundColor: "#494F39",
          color: "#fff",
          height: "40px",
          width: "180px",
          marginLeft: "1rem",
        }}
        onClick={createConversations}
      >
        Create Conversation
      </button>
    </div>
  );
};

export default User;
