import { useEffect, useState } from "react";

import { Users } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import {Loader2 } from "lucide-react";
import SidebarSkeleton from './skeletons/SidebarSkeleton'
const Sidebar = ({selectedUser,setSelectedUser}) => {
const [users,setUsers]=useState([])
  const  onlineUsers =[{}]
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [load,setLoad] = useState(false)
  const user =JSON.parse(localStorage.getItem('user'))

useEffect(()=>{
   const fetchUsers = async()=>{
    setLoad(true)
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
      };
      const res = await axios.get('/api/message/users',config)
      setUsers(res.data)
      console.log(res);
      setLoad(false)

      
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message)
      setLoad(false)

      
    }
   }
   fetchUsers()

},[])
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>
{
  load ? (
    <SidebarSkeleton  />

  ) :(
    
    <div className=" items-center justify-center overflow-y-auto w-full py-3">
    {users?.map((user) => (
      <button
        key={user?._id}
        onClick={()=>setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
      >
        <div className="relative mx-auto lg:mx-0 ">
          <img
            src={user?.profilePic || "data:image/png;base64,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"}
            alt={user?.name}
            className="size-12 object-cover rounded-full"
          />
          {onlineUsers?.includes(user?._id) && (
            <span
              className="absolute bottom-0 right-0 size-3 bg-green-500 
              rounded-full ring-2 ring-zinc-900"
            />
          )}
        </div>

        {/* User info - only visible on larger screens */}
        <div className="hidden lg:block text-left min-w-0">
          <div className="font-medium truncate">{user.fullName}</div>
          <div className="text-sm text-zinc-400">
            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
          </div>
        </div>
      </button>
    ))}

    {onlineUsers.length === 0 && (
      <div className="text-center text-zinc-500 py-4">No online users</div>
    )}
  </div>
  )
}
    </aside>
  );
};
export default Sidebar;