import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ShieldCheck } from 'lucide-react';

const OfflineToast = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      // THE LOCK: Ensure the user only ever sees this once
      const hasSeenToast = localStorage.getItem('hasSeenOfflineToast');

      if (hasSeenToast) {
        setOfflineReady(false);
        setIsVisible(false);
        return;
      }

      // THE EXECUTION: Mark as seen and show the UI
      localStorage.setItem('hasSeenOfflineToast', 'true');
      setIsVisible(true);
      setIsFading(false);

      // THE LIFECYCLE TIMERS
      const fadeTimer = setTimeout(() => setIsFading(true), 4500);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setOfflineReady(false);
      }, 5000);

      // CLEANUP: Prevent memory leaks if the component unmounts early
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [offlineReady, setOfflineReady]);

  // STRICT CONSTRAINT: Keep the DOM clean if not in use
  if (!isVisible || !offlineReady) return null;

  return (
    <div 
      className={`
        fixed top-6 left-1/2 z-[100] -translate-x-1/2
        flex items-center gap-3 px-5 py-3 rounded-full 
        bg-slate-900 border border-slate-700 shadow-2xl 
        transition-all duration-500 ease-in-out
        ${isFading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}
      `}
    >
      <div className="bg-emerald-500/20 rounded-full p-1.5 border border-emerald-500/30">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
      </div>
      <span className="text-sm font-medium text-slate-200 whitespace-nowrap">
        Arena is cached for offline battle
      </span>
    </div>
  );
};

export default OfflineToast;
