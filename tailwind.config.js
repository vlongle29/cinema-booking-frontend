/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            primary: "#f84565",
            secondary: "#09090b",
            "dark-bg": "#09090b",
            "card-bg": "#12161c",
            "nav-pill": "#d4d4d4",
            "border-custom": "rgba(183, 183, 183, 0.15)",
         },
         textColor: {
            primary: "#ffffff",
            secondary: "#d1d5dc",
            muted: "#797b7d",
         },
         fontFamily: {
            outfit: ["Outfit", "sans-serif"],
            heebo: ["Heebo", "sans-serif"],
         },
         spacing: {
            7.5: "1.875rem",
            17.5: "4.375rem",
            3.75: "15px",
         },
         gap: {
            3.75: "15px",
         },
         maxWidth: {
            common: "1200px",
         },
         height: {
            785: "785px",
            500: "500px",
            400: "400px",
            280: "280px",
            250: "250px",
            200: "200px",
            140: "140px",
         },
         width: {
            173: "173px",
         },
         keyframes: {
            slideDownAndFadeIn: {
               from: {
                  opacity: "0",
                  transform: "translateY(-8px)",
               },
               to: {
                  opacity: "1",
                  transform: "translateY(0)",
               },
            },
         },
         animation: {
            slideDownAndFadeIn:
               "slideDownAndFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
         },
      },
   },
   plugins: [],
};
