import { useEffect, useRef } from 'react';
import { Option } from 'funfix';
import { dummyEvent } from '../EventContext';
import { stateEventT } from '../types';

type usePreviousEventT = (oe: Option<stateEventT>) => stateEventT;
const usePreviousEvent: usePreviousEventT = (eventOption) => {
  const ref = useRef<stateEventT>(dummyEvent);
  useEffect(() => {
    eventOption.fold(
      () => {
        ref.current = dummyEvent;
      },
      (event) => {
        ref.current = event;
      },
    );
  });
  return ref.current;
};

export default usePreviousEvent;
