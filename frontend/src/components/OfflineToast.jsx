import { useEffect, useState, useRef } from 'react';
import { Zap } from 'lucide-react';

const OfflineToast = ({ session }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const lastSessionId = useRef(null);

  useEffect(() => {
    // TRIGGER: Only fire when the session is newly established/changed
    if (session?.user?.id && session.user.id !== lastSessionId.current) {
      lastSessionId.current = session.user.id;
      
      setIsVisible(true);
      setIsFading(false);

      // THE MAGICAL LIFECYCLE TIMERS
      const exitTimer = setTimeout(() => setIsFading(true), 4200);
      const unmountTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(unmountTimer);
      };
    } else if (!session) {
      // RESET: Allow it to fire again if the user logs out and back in
      lastSessionId.current = null;
      setIsVisible(false);
    }
  }, [session, isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed top-6 left-1/2 z-[200]
        flex items-center gap-4 px-6 py-3.5 rounded-full 
        bg-slate-950/60 border border-slate-700/50 shadow-2xl backdrop-blur-xl
        ring-1 ring-white/10
        ${isFading ? 'animate-toast-exit' : 'animate-toast-reveal'}
      `}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/50 blur-lg animate-pulse rounded-full"></div>
        <div className="relative bg-cyan-600/30 rounded-full p-1.5 border border-cyan-400/40">
          <Zap className="h-4 w-4 text-cyan-300" />
        </div>
      </div>
      
      <span className="text-sm font-bold tracking-wide text-shimmer whitespace-nowrap">
        Neural link established. Ready for high-speed engagement.
      </span>
    </div>
  );
};

export default OfflineToast;
