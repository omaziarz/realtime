import {NextApiHandler} from "next";
import {Server} from "socket.io";
import {secureApiRoute} from "@/lib/secureApiRoute";

const handler: NextApiHandler = async (req, res) => {
  const session = await secureApiRoute(req, res);

  console.log(session);

  // @ts-ignore
  if (res.socket?.server.io) {
    console.log("socket.io already initialized");
    return res.end();
  }

  // @ts-ignore
  const io = new Server(res.socket.server);
  // @ts-ignore
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    // @ts-ignore
    socket.data.id = session.id;
    // get total number of connected users
    console.log("total connected sockets", io.sockets.sockets.size)
    socket.on("disconnect", () => {
      console.log("socket.io disconnected");
    });
  });

  res.end();
}
export default handler;