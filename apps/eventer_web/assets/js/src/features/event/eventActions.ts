export const TOGGLE_CHAT = 'TOGGLE_CHAT';
export const SET_IS_CHAT_VISIBLE = 'SET_IS_CHAT_VISIBLE';

type actionTypeT = 'TOGGLE_CHAT' | 'SET_IS_CHAT_VISIBLE';

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT =
  | ack<'TOGGLE_CHAT', {}>
  | ack<'SET_IS_CHAT_VISIBLE', { isChatVisible: boolean }>;

type toggleChatT = () => actionT;
export const toggleChat: toggleChatT = () => {
  return { type: TOGGLE_CHAT, payload: {} };
};

type setIsChatVisibleT = (a: boolean) => actionT;
export const setIsChatVisible: setIsChatVisibleT = (isChatVisible) => {
  return { type: SET_IS_CHAT_VISIBLE, payload: { isChatVisible } };
};
