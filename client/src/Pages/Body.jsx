import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const Body = () => {
  const [isLogin, setIsLogin] = useState(true);

  const login = () => setIsLogin(true);
  const signup = () => setIsLogin(false);

  return (
    <div>{isLogin ? <Login signup={signup} /> : <Signup login={login} />}</div>
  );
};

export default Body;
