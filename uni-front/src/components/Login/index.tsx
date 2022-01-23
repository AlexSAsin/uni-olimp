import { ReactElement, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Alert, Button, Card, Form, Row } from 'react-bootstrap';

// import { Taxios } from '@simplesmiler/taxios';
// import Axios from 'axios';

import { AppDispatch, RootState } from 'redux/store';
import { authorizate } from 'redux/slices/auth';
import { Redirect } from 'react-router';

// const taxios = new Taxios<Swagger>(Axios.create({ baseURL: '/api' }));

function Login(): ReactElement {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState('');

  const submitCb = useCallback(async () => {
    try {
      await dispatch(
        authorizate({ login: login, password: password }),
      ).unwrap();
    } catch (e) {
      const error = e as ErrorResponse;
      switch (error.status) {
        case 400:
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setError(/\[(.*)\]/.exec(error.message)![1]);
          break;
        case 401:
          setError(error.message);
          break;
        case 403:
          setError('back is not a fool');
          break;
      }
    }
  }, [login, password, dispatch]);

  const submitOnEnter = useCallback(
    async (e) => {
      if (e.key === 'Enter') {
        await submitCb();
      }
    },
    [submitCb],
  );

  return (
    <LoginStyled>
      {user != null ? <Redirect to="/" /> : null}
      <Row className="h-100">
        <Card className="align-self-center w-472 p-3">
          <p className="mb-0">admin admin</p>
          <p className="mb-0">userr admin</p>
          {!error ? '' : <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-1" controlId="formBasicEmail">
              <Form.Label className="mb-0">Login:</Form.Label>
              <Form.Control
                placeholder="Enter login"
                value={login}
                onChange={(ev) => setLogin(ev.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="mb-0">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={submitOnEnter}
              />
            </Form.Group>
            <Button variant="success" className="w-100" onClick={submitCb}>
              Login {user?.id}
            </Button>
          </Form>
        </Card>
      </Row>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  height: 100vh;

  .w-472 {
    width: 472px;
    margin: auto;
  }

  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
    border: ${({ theme }) => theme.primaryBorder};
  }
`;

export default Login;
