import { ReactElement, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Container } from 'react-bootstrap';

import { AppDispatch, RootState } from 'redux/store';
import { alertSetViewed, alertsGet } from 'redux/slices/alerts';

import styled from 'styled-components';
import Alert from '.';
import { Eye } from 'react-bootstrap-icons';

function AlertList(): ReactElement {
  const dispatch: AppDispatch = useDispatch();

  const alerts = useSelector((store: RootState) => store.alerts.alerts);

  const setViewedCb = useCallback(
    (alertId: number) => {
      dispatch(alertSetViewed({ id: alertId }));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(alertsGet({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertListStyled>
      <Container className="mt-3">
        {alerts.map((alert) => (
          <div key={alert.updatedAt} className="d-flex flex-row mb-2">
            <div className="lc">
              <div
                className="btn-wrapper"
                onClick={() => setViewedCb(alert.id)}
              >
                <Eye />
              </div>
            </div>
            <div className="rc flex-grow-1">
              <Alert {...alert} />
            </div>
          </div>
        ))}
      </Container>
    </AlertListStyled>
  );
}

const AlertListStyled = styled.div`
  .lc {
    margin-right: 5px;
    font-size: 1.8em;
  }

  .lc > * {
    text-align: center;
  }

  .lc > .btn-wrapper > svg {
    vertical-align: middle;
  }

  .lc > .btn-wrapper {
    height: 50px;
    width: 70px;
  }

  .lc > .btn-wrapper:hover {
    background-color: ${({ theme }) => theme.primaryBgc};
  }
`;

export default AlertList;
