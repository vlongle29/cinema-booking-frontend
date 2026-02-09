import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SeatSelectPage.css";

const SeatSelectPage: React.FC = () => {
   const navigate = useNavigate();
   const [selectedTiming, setSelectedTiming] = useState<string>("06:30");
   const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

   const timings = ["06:30", "09:30", "12:00", "04:30", "08:00"];
   const rows = ["A", "B", "C", "D", "E", "F", "G"];
   const columns = Array.from({ length: 18 }, (_, i) => i + 1);

   // Sample booked seats (in a real app, this would come from API)
   const bookedSeats = new Set([
      "A1",
      "A2",
      "B4",
      "B5",
      "C2",
      "D1",
      "D3",
      "E5",
      "F2",
      "F4",
      "G6",
   ]);

   const toggleSeat = (row: string, column: number) => {
      const seatId = `${row}${column}`;
      if (bookedSeats.has(seatId)) return;

      const newSelected = new Set(selectedSeats);
      if (newSelected.has(seatId)) {
         newSelected.delete(seatId);
      } else {
         newSelected.add(seatId);
      }
      setSelectedSeats(newSelected);
   };

   const getSeatStatus = (
      row: string,
      column: number,
   ): "available" | "selected" | "booked" => {
      const seatId = `${row}${column}`;
      if (bookedSeats.has(seatId)) return "booked";
      if (selectedSeats.has(seatId)) return "selected";
      return "available";
   };

   const handleCheckout = () => {
      if (selectedSeats.size === 0) {
         alert("Please select at least one seat");
         return;
      }
      // In a real app, save selection to state/context and navigate
      navigate("/checkout", {
         state: { seats: Array.from(selectedSeats), timing: selectedTiming },
      });
   };

   return (
      <div className="seat-select-page">
         {/* Timings Section */}
         <div className="timings-section">
            <h3 className="timings-title">Available Timings</h3>
            {timings.map((timing) => (
               <button
                  key={timing}
                  className={`timing-item ${selectedTiming === timing ? "selected" : ""}`}
                  onClick={() => setSelectedTiming(timing)}
               >
                  {timing}
               </button>
            ))}
         </div>

         {/* Seat Selection Section */}
         <div className="seat-selection-section">
            {/* Header */}
            <div className="seat-select-header">
               <h2 className="seat-select-title">Select Your Seat</h2>
            </div>

            {/* Screen Indicator */}
            <div className="screen-indicator">
               <div className="screen-line"></div>
               <div className="screen-label">SCREEN SIDE</div>
            </div>

            {/* Seats Grid */}
            <div className="seats-grid-container">
               <div className="seats-grid">
                  {rows.slice(0, 2).map((row) => (
                     <div key={row} className="seat-row">
                        <div className="row-label">{row}</div>
                        <div className="seats-row-items">
                           {columns.map((col) => (
                              <button
                                 key={`${row}${col}`}
                                 className={`seat ${getSeatStatus(row, col)}`}
                                 onClick={() => toggleSeat(row, col)}
                                 disabled={getSeatStatus(row, col) === "booked"}
                                 title={`Seat ${row}${col}`}
                              />
                           ))}
                        </div>
                     </div>
                  ))}
               </div>

               <div className="seats-grid">
                  {rows.slice(2, 7).map((row) => (
                     <div key={row} className="seat-row">
                        <div className="row-label">{row}</div>
                        <div className="seats-row-items">
                           {columns.map((col) => (
                              <button
                                 key={`${row}${col}`}
                                 className={`seat ${getSeatStatus(row, col)}`}
                                 onClick={() => toggleSeat(row, col)}
                                 disabled={getSeatStatus(row, col) === "booked"}
                                 title={`Seat ${row}${col}`}
                              />
                           ))}
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Column Numbers */}
            <div className="column-numbers">
               {columns.map((col) => (
                  <div key={col} className="column-label">
                     {col}
                  </div>
               ))}
            </div>

            {/* Seat Info */}
            <div className="seat-info">
               <div className="seat-info-item">
                  <div className="seat-info-box available"></div>
                  <span>Available</span>
               </div>
               <div className="seat-info-item">
                  <div className="seat-info-box selected"></div>
                  <span>Selected ({selectedSeats.size})</span>
               </div>
               <div className="seat-info-item">
                  <div className="seat-info-box booked"></div>
                  <span>Booked</span>
               </div>
            </div>

            {/* Checkout Section */}
            <div className="checkout-section">
               <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to checkout
               </button>
            </div>
         </div>
      </div>
   );
};

export default SeatSelectPage;
