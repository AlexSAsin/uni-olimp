import { createGlobalStyle } from 'styled-components';

export const GlobalStyled = createGlobalStyle`
  body, html {
    min-height: 100vh;
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.primaryColor};
    font-family: 'Roboto';
    font-size: 16px;
    text-align: left;
  }

  input[type="password"] {
    font-family: 'Fan' !important;
  }
  input[type="password"]::placeholder {
    font-family: 'Roboto';
  }

  .btn {
    background-color: ${({ theme }) => theme.bgcBtn};
    border-width: 2px;
  }

  .btn-success {
    color: ${({ theme }) => theme.successColor};
    border-color: ${({ theme }) => theme.successColor};
  }

  .btn-success:hover{
    background-color: ${({ theme }) => theme.successColor};
  }

  .btn-secondary {
    color: ${({ theme }) => theme.primaryColor};
    border: ${({ theme }) => theme.primaryBorder};
  }

  .btn-secondary:hover{
    color: ${({ theme }) => theme.primaryColor};
    background-color: ${({ theme }) => theme.primaryBgc};
    border-color: ${({ theme }) => theme.primaryColor};
  }

  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
  }
`;
