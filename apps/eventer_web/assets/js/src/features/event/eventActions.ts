export const TOGGLE_CHAT = 'TOGGLE_CHAT';
export const SET_IS_CHAT_VISIBLE = 'SET_IS_CHAT_VISIBLE';
export const SET_IS_CHANNEL_JOINED = 'SET_IS_CHANNEL_JOINED';

type actionTypeT =
  | 'TOGGLE_CHAT'
  | 'SET_IS_CHAT_VISIBLE'
  | 'SET_IS_CHANNEL_JOINED';

type ack<typeT extends actionTypeT, payloadT> = {
  payload: payloadT;
  type: typeT;
};

export type actionT =
  | ack<'TOGGLE_CHAT', {}>
  | ack<'SET_IS_CHAT_VISIBLE', { isChatVisible: boolean }>
  | ack<'SET_IS_CHANNEL_JOINED', { isChannelJoined: boolean }>;

type toggleChatT = () => actionT;
export const toggleChat: toggleChatT = () => ({ type: TOGGLE_CHAT, payload: {} });

type setIsChatVisibleT = (a: boolean) => actionT;
export const setIsChatVisible: setIsChatVisibleT = (isChatVisible) => (
  { type: SET_IS_CHAT_VISIBLE, payload: { isChatVisible } }
);

type setIsChannelJoinedT = (a: boolean) => actionT;
export const setIsChannelJoined: setIsChannelJoinedT = (isChannelJoined) => (
  { type: SET_IS_CHANNEL_JOINED, payload: { isChannelJoined } }
);
