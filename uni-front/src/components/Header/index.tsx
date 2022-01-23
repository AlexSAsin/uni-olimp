import { ReactElement, useCallback } from 'react';

import styled from 'styled-components';
import { Container } from 'react-bootstrap';

import { AppDispatch, RootState } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from 'redux/slices/auth';
import LinkBtn from './LinkBtn';
import { useLocation } from 'react-router';
import { useInterval } from 'react-interval-hook';
import { alertsGetCount } from 'redux/slices/alerts';

function Header(): ReactElement {
  const path = useLocation();
  const dispatch: AppDispatch = useDispatch();

  const userRole = useSelector((store: RootState) => store.auth.user?.roleName);

  const alertsCount = useSelector((store: RootState) => store.alerts.count);

  const logoutCb = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useInterval(() => {
    dispatch(alertsGetCount({}));
  }, 1000);

  return (
    <LoginStyled>
      <Container className="h-100">
        <div className="float-start h-100 lc">
          <LinkBtn text="Posts" to="/" isActive={path.pathname === '/'} />
        </div>
        <div className="float-end h-100 rc">
          {userRole !== 'admin' ? null : (
            <LinkBtn
              text="Manage posts"
              to="/manage-posts"
              isActive={path.pathname === '/manage-posts'}
            />
          )}
          <LinkBtn
            text="Create post posts"
            to="/create-post"
            isActive={path.pathname === '/create-post'}
          />
          <LinkBtn
            text="alerts"
            to="/alerts"
            counter={alertsCount}
            isActive={path.pathname === '/alerts'}
          />
          <div onClick={logoutCb}>
            <LinkBtn text="Logout" to="/" />
          </div>
        </div>
      </Container>
    </LoginStyled>
  );
}

const LoginStyled = styled.div`
  background-color: ${({ theme }) => theme.primaryBgc};
  height: 62px;
  border-bottom: ${({ theme }) => theme.primaryBorder};

  .lc > :not(:first-of-type),
  .rc > :not(:first-of-type) {
    margin-left: 12px;
  }

  .lc > *,
  .rc > * {
    float: left;
  }
`;

export default Header;
