import { io } from "socket.io-client";
import { SOCKET_URL } from "./const";

export const createSocketConnection = () => {
  return io(SOCKET_URL);
};
