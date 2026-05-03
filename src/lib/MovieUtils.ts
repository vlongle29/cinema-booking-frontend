export const formatDuration = (duration: number) => {
   const hours = Math.floor(duration / 60);
   const minutes = duration % 60;

   if (hours && minutes) return `${hours}h ${minutes}m`;
   if (hours) return `${hours}h`;
   return `${minutes}m`;
};
