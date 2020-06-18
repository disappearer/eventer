import { useEffect, useState } from 'react';
import { CHAT_HIDING_BREAKPOINT } from '../Chat/Chat.util';

const chatHidingBreakpoint = parseInt(CHAT_HIDING_BREAKPOINT, 10);

// TODOR: EMOVE? DO EYE NEAD DIS?
type useChatHiddingBreakpointT = () => boolean;
const useChatHiddingBreakpoint: useChatHiddingBreakpointT = () => {
  const [isWide, setIsWide] = useState(false);
  function getSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const { width } = getSize();
    if (width > chatHidingBreakpoint) {
      setIsWide(true);
    }
    function handleResize() {
      const { width } = getSize();
      if (width > chatHidingBreakpoint && !isWide) {
        setIsWide(true);
      } else if (isWide) {
        setIsWide(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isWide]);

  return isWide;
};

export default useChatHiddingBreakpoint;
