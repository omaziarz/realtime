import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    socket: Socket;
  }
}

export default function useSocket() {
  useEffect(() => {
    initSocket().catch();
  }, []);

  const queryClient = useQueryClient();
  const session = useSession();

  const initSocket = async () => {
    await fetch("/api/socket");

    if (typeof window === "undefined") return;

    console.log(session.data?.id);

    const socket = io({
      auth: { id: session.data?.id || "" },
    });
    window.socket = socket;

    socket.on("connect", () => {
      console.log("connected");

      socket.on("admin-availability", async () => {
        console.log("admin-availability");
        await queryClient.invalidateQueries(["available-admins"]);
      });

      socket.on("user-disconnected", async () => {
        console.log("user-disconnected");
        await queryClient.invalidateQueries(["chat-requests"]);
      });

      socket.on("discussion-requested", async () => {
        await queryClient.invalidateQueries(["chat-requests"]);
      });

      socket.on("update-discussion-request", async () => {
        console.log("update-discussion-request");
        await queryClient.invalidateQueries(["discussion-request"]);
      });
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  };
}
