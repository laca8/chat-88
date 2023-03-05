import axios from "axios";
import React, { useEffect, useState } from "react";
const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      const res = await axios.get(`/api/user/${friendId}`);
      setUser(res.data);
    };
    getUser();
  }, [currentUser]);
  return (
    <div className="conversation">
      <img className="conversationImg" src={user?.profile} alt="" />
      <span className="conversationName">{user?.name}</span>
    </div>
  );
};
export default Conversation;
