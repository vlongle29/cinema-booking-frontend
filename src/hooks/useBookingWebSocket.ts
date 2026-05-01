import { useEffect, useRef, useState, useContext } from "react";
import { WS_ACTIONS, SEAT_STATUS } from "../constants/websocketEvents";
import { AuthContext } from "../context/AuthContext";

export const useBookingWebSocket = (showtimeId: string) => {
   const [seatStatus, setSeatStatus] = useState<Record<string, string>>({});
   const wsRef = useRef<WebSocket | null>(null);
   const authContext = useContext(AuthContext);
   const accessToken = authContext?.accessToken;

   useEffect(() => {
      if (!showtimeId || !accessToken) return;

      // Connect to WebSocket server
      const ws = new WebSocket("ws://localhost:8080/ws/booking");
      wsRef.current = ws;

      ws.onopen = () => {
         ws.send(
            JSON.stringify({
               type: WS_ACTIONS.SUBSCRIBE_SHOWTIME,
               showtimeId: showtimeId,
            }),
         );
      };

      ws.onmessage = (event) => {
         const data = JSON.parse(event.data);

         switch (data.type) {
            case WS_ACTIONS.CONNECTED:
               break;

            case WS_ACTIONS.SUBSCRIBE_SHOWTIME:
               break;

            case WS_ACTIONS.SEAT_SELECTED:
               setSeatStatus((prevSeats) => ({
                  ...prevSeats,
                  [data.seatId]: SEAT_STATUS.LOCKED,
               }));
               break;

            case WS_ACTIONS.SEAT_RELEASED:
               setSeatStatus((prevSeats) => ({
                  ...prevSeats,
                  [data.seatId]: SEAT_STATUS.AVAILABLE,
               }));
               break;

            case WS_ACTIONS.SEAT_BOOKED:
               setSeatStatus((prevSeats) => ({
                  ...prevSeats,
                  [data.seatId]: SEAT_STATUS.BOOKED,
               }));
               break;

            case WS_ACTIONS.PONG:
               break;

            case WS_ACTIONS.PING:
               break;

            default:
               console.warn(`Unknown WebSocket message type: ${data.type}`);
         }
      };

      ws.onerror = (error) => console.error(`WebSocket error:`, error);

      ws.onclose = () => console.log("WebSocket disconnected");

      return () => {
         ws.close();
      };
   }, [showtimeId, accessToken]);

   // const lockSeat = (seatId: string) => {
   //    wsRef.current?.send(
   //       JSON.stringify({
   //          action: WS_ACTIONS.LOCK_SEAT,
   //          showtimeId: showtimeId,
   //          seatId: seatId,
   //       }),
   //    );
   // };

   // const unlockSeat = (seatId: string) => {
   //    wsRef.current?.send(
   //       JSON.stringify({
   //          action: WS_ACTIONS.UNLOCK_SEAT,
   //          showtimeId: showtimeId,
   //          seatId: seatId,
   //       }),
   //    );
   // };

   return {
      seatStatus,
   };
};
