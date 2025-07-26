import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Feed from "../components/Feed";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../slices/useSlice";
import { Outlet, useNavigate } from "react-router";
import { ToastContainer } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const fetchUser = async () => {
    if (user) return;

    try {
      const res = await axios.get("http://localhost:7000/api/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data.user));
    } catch (error) {
      // ✅ FIX: error.status doesn't exist — use error.response.status
      console.error(error);
      if (error.response && error.response.status === 401) {
        navigate("/"); // redirect to login/home
      }
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Home;
