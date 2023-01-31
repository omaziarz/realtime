import { NextApiHandler } from "next";
import { Server, Socket } from "socket.io";
import { secureApiRoute } from "@/lib/secureApiRoute";

const Rooms = {
  ADMIN: "admin",
  ADMIN_AVAILABLE: "admin-available",
  USER: "user",
};

const handler: NextApiHandler = async (req, res) => {
  //remove cache on this route
  res.setHeader("Cache-Control", "no-store");

  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", async (socket) => {
      console.log("session", socket.handshake.auth);
      const user = await prisma?.user.findUnique({
        where: {
          id: socket.handshake.auth.id,
        },
      });
      socket.data.user = user;
      console.log("user", socket.data.user);
      if (!user) {
        socket.disconnect();
      }

      socket.on("chat_join", (data) => {
        console.log("chat-join", data);
        socket.join(data.chatId);
      });

      socket.on("chat_leave", (data) => {
        console.log("chat-leave", data);
        socket.leave(data.chatId);
      });

      socket.on("message", (data) => {
        console.log("message", data);
        console.log("rooms", socket.rooms);
        io.in(data.chatId).emit("message", { chatId: data.chatId });
      });

      if (socket.data.user.role === "ADMIN") {
        socket.join(Rooms.ADMIN);
        console.log("admin connected");

        socket.on("admin-available", () => {
          console.log("admin-available");
          socket.join(Rooms.ADMIN_AVAILABLE);
          io.to(Rooms.USER).emit(
            "admin-availability",
            io.sockets.adapter.rooms.get(Rooms.ADMIN_AVAILABLE)?.size
          );
        });

        socket.on("admin-unavailable", () => {
          console.log("admin-unavailable");

          socket.leave(Rooms.ADMIN_AVAILABLE);
          io.to(Rooms.USER).emit(
            "admin-availability",
            io.sockets.adapter.rooms.get(Rooms.ADMIN_AVAILABLE)?.size
          );
        });

        socket.on("update-discussion-request", async (data) => {
          console.log("update-discussion-request", data);
          io.to(data.id).emit("update-discussion-request");
        });
      } else {
        console.log("user connected");
        socket.join(Rooms.USER);
        socket.join(socket.data.user.id);
        socket.on("disconnect", async () => {
          io.to(Rooms.ADMIN).emit("user-disconnected");
          await prisma?.adminDiscussionRequest.delete({
            where: { userId: socket.data.user.id },
          });
        });

        socket.on("discussion-requested", () =>
          io.to(Rooms.ADMIN).emit("discussion-requested")
        );
      }

      // get total number of connected users
      console.log("total connected sockets", io.sockets.sockets.size);
      socket.on("disconnect", () => {
        console.log("socket disconnected");
      });
    });
  }

  res.end();
};
export default handler;
