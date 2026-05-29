type GlowEffectProps = {
   className?: string;
};

export default function BlurredCircle({ className = ""}: GlowEffectProps) {
   return (
      <div
         className={`
            absolute
            w-60
            h-60
            rounded-full
            bg-primary/30
            blur-3xl
            pointer-events-none
            ${className}
         `}
      />
   );
}
