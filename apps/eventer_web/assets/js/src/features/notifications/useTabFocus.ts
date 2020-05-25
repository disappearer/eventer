import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIsTabFocused } from './notificationActions';

const useTabFocus = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener('blur', () => dispatch(setIsTabFocused(false)));
    window.addEventListener('focus', () => dispatch(setIsTabFocused(true)));
  }, []);
};

export default useTabFocus;
