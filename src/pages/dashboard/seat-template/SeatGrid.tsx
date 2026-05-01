import React, { memo } from 'react';
import type { Seat, SeatType } from '../../../types/booking';

// Wrap SeatCell by memo for optimize render performance
const SeatCell = memo(({ seat, seatType, index, onClick, onContextMenu, readOnly }: { seat: any, seatType: any, index: number, onClick?: (index: number) => void, onContextMenu?: (index: number) => void, readOnly: boolean }) => {
  const isAisle = seat.isAisle;

  return (
    <div
      onClick={() => !readOnly && onClick?.(index)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (!readOnly) onContextMenu?.(index);
      }}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 rounded-t-xl rounded-b-md 
        flex items-center justify-center text-[10px] sm:text-xs font-medium select-none 
        transition-all duration-200
        ${readOnly ? 'cursor-default opacity-80' : 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95'}
        ${isAisle 
          ? 'bg-transparent border-2 border-dashed border-[#393939] text-[#797b7d] hover:translate-y-0 hover:shadow-none hover:bg-[#393939]/20' 
          : 'text-white shadow-sm ring-1 ring-white/10'}
      `}
      // Use inline-style for background color because Hex code is returned dynamically from Database
      style={!isAisle && seatType ? { backgroundColor: seatType.color } : {}}
      title={!isAisle ? `${seat.seatNumber} - ${seatType?.name}` : 'Aisle'}
    >
      {!isAisle && (
        <span className="text-xs sm:text-sm font-bold text-white drop-shadow-md tracking-tight">
          {seat.seatNumber}
        </span>
      )}
    </div>
  );
});

const SeatGrid = ({ seats, columns, seatTypes, onSeatClick, onSeatRightClick, readOnly = false }: { seats: any[], columns: number, seatTypes: any[], onSeatClick?: (index: number) => void, onSeatRightClick?: (index: number) => void, readOnly?: boolean }) => {
  return (
    <div className="w-full overflow-x-auto p-6 sm:p-8 bg-[#1a1a1e] rounded-2xl border border-[#393939] shadow-inner">
       {/* Screen Indicator */}
      <div className="mb-14 flex flex-col items-center justify-center select-none w-full min-w-[300px]">
        <div className="w-full max-w-xl h-2 bg-gradient-to-r from-transparent via-[#f84565] to-transparent rounded-full mb-3 opacity-80 shadow-[0_4px_20px_rgba(248,69,101,0.4)]"></div>
        <span className="text-[#797b7d] font-bold tracking-[0.4em] uppercase text-xs">Màn hình</span>
      </div>

      <div 
        className="grid gap-2 sm:gap-2.5 mx-auto" 
        style={{ 
          // Set dynamic columns based on state
          gridTemplateColumns: `repeat(${columns}, minmax(0, max-content))`,
          width: 'max-content'
        }}
      >
        {seats.map((seat: any, index: number) => {
          const seatType = seatTypes.find((t: any) => t.id === seat.seatTypeId);
          return (
            <SeatCell
              key={`${seat.seatNumber}-${index}`}
              index={index}
              seat={seat}
              seatType={seatType}
              onClick={onSeatClick}
              onContextMenu={onSeatRightClick}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(SeatGrid);