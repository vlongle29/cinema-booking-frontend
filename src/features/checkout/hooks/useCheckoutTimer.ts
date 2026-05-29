import { useState, useEffect } from "react";
import {formatTime} from "@/utils/formatters";

export const useCheckoutTimer = (initialSeconds = 600) => {
   const [countdown, setCountdown] = useState(initialSeconds);

   useEffect(() => {
      if (countdown <= 0) return;
      const timer = setInterval(() => {
         setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
   }, [countdown]);

   
   return { countdown, formattedTime: formatTime(countdown) };
};
