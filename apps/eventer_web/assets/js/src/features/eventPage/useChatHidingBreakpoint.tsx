import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CHAT_HIDING_BREAKPOINT } from './Chat';
import { setIsChatVisible } from './eventActions';

const chatHidingBreakpoint = parseInt(CHAT_HIDING_BREAKPOINT, 10);

const useChatHiddingBreakpoint = () => {
  const dispatch = useDispatch();

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
        dispatch(setIsChatVisible(true));
        setIsWide(true);
      } else if (isWide) {
        dispatch(setIsChatVisible(false));
        setIsWide(false);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isWide]);
};

export default useChatHiddingBreakpoint;
