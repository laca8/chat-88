import Navbar from "./component/Navbar";

import HomePage from "./pages/Home";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";

import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'

import { useEffect,useState } from "react";
import io from 'socket.io-client'
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
const App = () => {
  const BASE_URL = "http://localhost:5001"
  let socket = io.connect(BASE_URL) 

 
const user =JSON.parse(localStorage.getItem('user'))
const theme =JSON.parse(localStorage.getItem('theme'))
const [currentTheme, setCurrentTheme] = useState(theme);
  
  return (
    <div data-theme={currentTheme}>
       <Navbar /> 
      <BrowserRouter>
       <Routes>
      <Route element={user ? <HomePage socket={socket}/> : <Navigate to='/login'/> } path="/"></Route>
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to='/'/>} ></Route>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/'/>} ></Route>
        <Route path="/settings" element={<SettingsPage setCurrentTheme={setCurrentTheme} />} ></Route>
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to='/login'/>}></Route>
      </Routes>
    </BrowserRouter>
      

      <Toaster />
    </div>
  );
};
export default App;