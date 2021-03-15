/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect } from 'react'
import styled from 'styled-components'

import { createPortal } from 'react-dom'

const ModalContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContentWrapper = styled.div`
  box-shadow: 0 2px 6px 0 hsla(0, 0%, 0%, 0.2);
  background-color: #ffffff;
  border-radius: 5px;
  margin: 20px;
  @media (max-width: 576px) {
    & > div {
      padding: 20px;
    }
  }
`

const element = document.body.appendChild(document.createElement('div'))

const Modal = ({ onClickOutSide, children, className = '' }) => {
  useEffect(() => {
    document.body.classList.add('no-scroll')
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [])

  return createPortal(
    <ModalContainer onClick={onClickOutSide}>
      <ContentWrapper className={className} onClick={e => e.stopPropagation()}>
        {children}
      </ContentWrapper>
    </ModalContainer>,
    element,
  )
}

export default Modal