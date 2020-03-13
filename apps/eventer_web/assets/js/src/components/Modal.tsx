import React, { RefObject, useEffect, useRef } from 'react';

type modalPropsT = {
  shouldShowModal: boolean;
  hideModal: () => void;
};

const Modal: React.FC<modalPropsT> = ({ shouldShowModal, hideModal, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClickHandler(modalRef, hideModal);

  return (
    <div
      id="myModal"
      className="modal"
      style={{ display: shouldShowModal ? 'block' : 'none' }}
      ref={modalRef}
    >
      <div className="modal-content">
        {children}
      </div>
    </div>
  );
};

export default Modal;

type useOutsideClickHandlerT = (ref: RefObject<HTMLDivElement>, callback: () => void) => void;
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
