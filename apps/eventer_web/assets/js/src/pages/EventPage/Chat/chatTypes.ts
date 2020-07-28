export type messageT = {
  id: number | string;
  text: string;
  user_id: number;
  inserted_at: string;
  is_bot: boolean;
};

export type singleMessageT = {
  isGroup: false;
  message: messageT;
};

export type messageGroupT = {
  isGroup: true;
  userId: number;
  startTime: Date;
  messages: messageT[];
};

export type chatMessageT = singleMessageT | messageGroupT;

export type dayMessagesT = {
  day: string;
  messages: chatMessageT[];
};

export type groupChatMessagesT = (messages: messageT[]) => dayMessagesT[];
