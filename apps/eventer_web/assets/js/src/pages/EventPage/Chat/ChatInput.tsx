import React, { FC, useMemo } from 'react';
import {
  Input,
  ChatSendBtnMobile,
  SendBtnWrapper,
  ChatInputWrapper,
} from './Chat.styles';
import { getOSAndBrowser } from '../../../util/deviceInfo';

type chatInputT = {
  inputRef: React.RefObject<HTMLDivElement>;
  messageText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleEnterKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleResize: (e: Event) => void;
  submitForm: () => void;
};

const ChatInput: FC<chatInputT> = ({
  inputRef,
  messageText,
  handleInputChange,
  handleEnterKeyPress,
  handleResize,
  submitForm,
}) => {
  const isMobile = useMemo(() => {
    const { os } = getOSAndBrowser();
    return os === 'Android' || os === 'iOS';
  }, []);

  return (
    <ChatInputWrapper ref={inputRef}>
      <Input
        value={messageText}
        onChange={handleInputChange}
        onKeyPress={handleEnterKeyPress}
        onResize={handleResize}
        maxRows={4}
      />
      {isMobile && (
        <SendBtnWrapper>
          <ChatSendBtnMobile onClick={submitForm} />
        </SendBtnWrapper>
      )}
    </ChatInputWrapper>
  );
};

export default ChatInput;
