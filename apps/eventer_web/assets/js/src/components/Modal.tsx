import React, { RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CHAT_HIDING_BREAKPOINT } from '../pages/EventPage/Chat/Chat.util';
import { Close } from '@styled-icons/evil/Close';

const ModalWrapper = styled.div`
  padding: 40px;
  position: relative;

  @media (max-width: ${CHAT_HIDING_BREAKPOINT}px) {
    padding: 11px;
  }
`;

const ModalCloseBtn = styled(Close)`
  position: absolute;
  top: 11px;
  right: 11px;
  width: 29px;
  height: 29px;
  color: ${({ theme }) => theme.colors.roseOfSharon};

  &:hover {
    color: ${({ theme }) => theme.colors.roseOfSharonDark};
    cursor: pointer;
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

  const handleEscapeKeyPress = (event: KeyboardEvent) => {
    if (event.key == 'Escape') {
      hideModal();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleEscapeKeyPress);
    return () => {
      document.removeEventListener('keyup', handleEscapeKeyPress);
    };
  }, []);

  return (
    <div
      id="myModal"
      className="modal"
      style={{ display: shouldShowModal ? 'grid' : 'none' }}
      ref={modalRef}
    >
      <div className="modal-content">
        <ModalWrapper>
          <ModalCloseBtn onClick={hideModal} />
          {children}
        </ModalWrapper>
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
