import "./App.css";
import Messenger from "./components/Massenger/Messenger";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
const App = () => {
  const userInfo = localStorage.getItem("userInfo");
  return (
    <Router>
      <Route exact path="/" component={userInfo ? Messenger : Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
    </Router>
  );
};

export default App;
