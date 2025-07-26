import { createBrowserRouter } from "react-router";
import Applayout from "./Pages/Applayout";
import { RouterProvider } from "react-router/dom";
import Home from "./Pages/Home";
import CompleteProfile from "./components/CompleteProfile";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import ConnectionRequest from "./components/ConnectionRequest";
import Connections from "./components/Connections";
import MembershipPage from "./components/Membership";
import Chat from "./components/Chat";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout />,
    },
    {
      path: "/home",
      element: <Home />,
      children: [
        {
          index: true,
          element: <Feed />,
        },
        {
          path: "complete-profile",
          element: <CompleteProfile />,
        },

        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "connectionReq",
          element: <ConnectionRequest />,
        },
        {
          path: "connections",
          element: <Connections />,
        },
        {
          path: "membership",
          element: <MembershipPage />,
        },
        {
          path: "connections/chat/:targetUserId",
          element: <Chat />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
