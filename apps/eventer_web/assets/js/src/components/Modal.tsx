import React, { RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from '../pages/EventPage/Chat/Chat.util';

const ModalWrapper = styled.div`
  padding: 20px;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    padding: 11px;
  }
`;

type modalPropsT = {
  shouldShowModal: boolean;
  hideModal: () => void;
};

const Modal: React.FC<modalPropsT> = ({
  shouldShowModal,
  hideModal,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClickHandler(modalRef, hideModal);

  return (
    <div
      id="myModal"
      className="modal"
      style={{ display: shouldShowModal ? 'grid' : 'none' }}
      ref={modalRef}
    >
      <div className="modal-content">
        <ModalWrapper>{children}</ModalWrapper>
      </div>
    </div>
  );
};

export default Modal;

type useOutsideClickHandlerT = (
  ref: RefObject<HTMLDivElement>,
  callback: () => void,
) => void;
const useOutsideClickHandler: useOutsideClickHandlerT = (ref, callback) => {
  function handleClickOutside(event: any) {
    if (ref.current === event.target) {
      callback();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};
