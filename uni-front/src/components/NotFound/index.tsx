import { ReactElement } from 'react';

import styled from 'styled-components';
import { Container } from 'react-bootstrap';

function Header(): ReactElement {
  return (
    <LoginStyled>
      <Container>NotFound</Container>
    </LoginStyled>
  );
}

const LoginStyled = styled.div``;

export default Header;
