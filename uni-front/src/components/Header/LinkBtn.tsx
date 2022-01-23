import { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

interface LinkBtnProp {
  text: string;
  to: string;
  isActive?: boolean;
  counter?: number;
}

function LinkBtn(prop: LinkBtnProp): ReactElement {
  return (
    <LinkBtnStyled>
      <div className={prop.isActive ? 'active' : ''}>
        <Link className="align-middle h-100" to={prop.to}>
          <span>{prop.text}</span>
          {prop.counter != null && prop.counter > 0 ? (
            <span className="counter ms-1 rounded">{prop.counter}</span>
          ) : null}
        </Link>
      </div>
    </LinkBtnStyled>
  );
}

const LinkBtnStyled = styled.div`
  display: inline-block;
  height: 100%;
  line-height: 58px;
  color: ${({ theme }) => theme.primaryColor};
  position: relative;
  text-transform: uppercase;

  > * {
    height: 100%;
    padding: 0 2px;
  }

  :hover {
    color: ${({ theme }) => theme.hightlightColor};
  }

  a {
    display: block;
    height: 100%;
    font-weight: bold;
    text-decoration: none;
    color: inherit;
  }

  .active {
    color: ${({ theme }) => theme.hightlightColor};
    border-bottom: 3px solid ${({ theme }) => theme.hightlightColor};
  }

  .counter {
    background-color: ${({ theme }) => theme.alertInfoBgc};
    border: ${({ theme }) => theme.primaryBorder};
    font-size: 0.9em;
    padding: 0 0.3em;
  }
`;

export default LinkBtn;
