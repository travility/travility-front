import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  :root {
    --main-color: #657df9;
    --second-color: #4c66f8;
    --bold-color: #343683;
    --dark-color: #11183B;
    --light-color: #eff3ff;
    --point-color: #ff8bd2;
    --pointor-color: #FEC144;
    --line-color: #ECECEC;
    --gray-color: #9D9D9D;
    --background-color: #ffffff;
    --text-color: #121212;
    --shadow-color: rgba(0, 0, 0, 0.1);
    --font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    }

  @font-face {
    font-family: 'GoryeongStrawberry';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-01@1.0/GoryeongStrawberry.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
  }

  [data-theme="dark"] {
    --background-color: #121212;
    --text-color: #ffffff;
    --line-color: #657df9;
    --light-color: #343683;
    --bold-color: #eff3ff;
    --shadow-color: rgba(255, 255, 255, 0.2);
  }

  html {
    font-size: 100%;
  }

  // @media (max-width: 480px) {
  //   html {
  //     font-size: 75%;
  //   }
  // }

  @media (max-width: 767px) {
    html {
      font-size: 87.5%;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    html {
      font-size: 100%;
    }
  }

  @media (min-width: 1025px) {
    html {
      font-size: 112.5%;
    }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }

  h1, h2, h3, h4, h5, h6, span, p, div, button, input {
    word-break: keep-all;
    white-space: pre-wrap;
  }

  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  .header-wrapper {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    margin: 1.5rem 0;
  }

  .wrapper {
    width: 100%
  }

  .error_container {
    height: 1rem;
    margin-top: 0.1rem;
    display: flex;
    justify-content: space-between;
  }
`;

const Inner = styled.div`
  max-width: 1025px;
  margin: 0 auto;
  position: relative;
`;

const Container = styled.div`
  padding: 3rem 4rem;

  @media (max-width: 540px) {
    padding: 3rem 2.5rem;
  }
`;

const Button = styled.button`
  background-color: var(--main-color);
  color: #ffffff;
  width: 100%;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.5rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--second-color);
  }

  &:disabled {
    background-color: var(--line-color);
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  // margin-top: 0.2rem;
  width: 100%;
  border: 1px solid var(--line-color);
  border-radius: 0.3rem;
  color: var(--text-color);
  background-color: var(--background-color);
  transition: border-color 0.3s;
  font-size: 0.7rem;

  &:focus {
    background-color: ${({ theme }) => theme.focusBackground};
    border: 1px solid var(--second-color);
    outline: none;
  }

  &::placeholder {
    color: var(--gray-color);
  }

  &[type="date"] {
    font-family: var(--font-family);
    padding: 0.4rem;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 530px) {
    padding: 0.7rem;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 0.2rem;
  font-size: 0.6em;
  color: var(--pointor-color);
  letter-spacing: -1px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: var(--background-color);
  color: var(--text-color);
  padding: 2rem;
  border: 1px solid var(--line-color);
  border-radius: 0.5rem;
  width: 25rem;
  max-height: 80vh;
  overflow-y: scroll;
  margin: 2rem auto;
  transition: all 0.3s ease-in-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5em;
  font-weight: 700;
`;

const CloseButton = styled.div`
  padding: 0;
  margin-top: 0;
  height: 100%;
  width: auto;
  border: none;
  background-color: transparent;
  color: var(--main-color);
  cursor: pointer;

  &:hover {
    color: var(--second-color);
  }
`;

export {
  GlobalStyle,
  Inner,
  Container,
  Button,
  Input,
  ErrorMessage,
  ModalOverlay,
  Modal,
  ModalHeader,
  CloseButton,
};
