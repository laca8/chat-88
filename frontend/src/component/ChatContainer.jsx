
import { useEffect, useRef,useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";


const ChatContainer = ({selectedUser,setSelectedUser,socket}) => {
    const [load,setLoad]= useState(false)
    const [messages,setMessages] = useState([])
const user =JSON.parse(localStorage.getItem('user'))
 
 
  const messageEndRef = useRef(null);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
useEffect(()=>{
    const fetchMessages = async()=>{
      setLoad(true)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            token: user.token,
          },
        };
         const res = await axios.get(`/api/message/${selectedUser._id}`,config)
         setMessages(res.data)
         console.log(res);
         setLoad(false)
         
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message)
      setLoad(false)       
      }
    }
    fetchMessages()
},[selectedUser._id])
  

  if (load) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader setSelectedUser={setSelectedUser} selectedUser={selectedUser} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.filter((obj,i,self)=> i === self.findIndex((t)=> t._id == obj._id))?.filter((x)=> x?.senderId == selectedUser?._id && x?.recieverId == user?._id || x?.senderId == user?._id && x?.recieverId == selectedUser?._id )?.map((message) => (
          <div
            key={message?._id}
            className={`chat ${message?.senderId === user?._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message?.senderId === user?._id
                      ? user?.profilePic || "/avatar.png"
                      : user?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
      
                {new Date(message?.createdAt)?.toLocaleDateString("en-US", {
     hour: "2-digit",
     minute: "2-digit",
    hour12: false,
  })}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput setSelectedUser={setSelectedUser} selectedUser={selectedUser} messages={messages} setMessages={setMessages} socket={socket} />
    </div>
  );
};
export default ChatContainer;