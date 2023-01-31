import {io} from "socket.io-client";
import {useEffect} from "react";

export default function useSocket() {

  useEffect(() => {
    initSocket().catch();
  }, []);

  const initSocket = async () => {
    await fetch('/api/socket');

    const socket = io();


    socket.on('connect', () => {
      console.log('connected');
    });
  }
}