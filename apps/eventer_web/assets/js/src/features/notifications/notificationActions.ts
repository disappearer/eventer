export const SET_IS_TAB_FOCUSED = 'SET_IS_TAB_FOCUSED';

type actionTypeT = 'SET_IS_TAB_FOCUSED';

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT = ack<'SET_IS_TAB_FOCUSED', { isTabFocused: boolean }>;


type setIsTabFocusedT = (a: boolean) => actionT;
export const setIsTabFocused: setIsTabFocusedT = (isTabFocused) => {
  return { type: SET_IS_TAB_FOCUSED, payload: { isTabFocused } };
};
