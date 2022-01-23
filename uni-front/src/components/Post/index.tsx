import { ReactElement, useState } from 'react';
import { useInterval } from 'react-interval-hook';

import styled from 'styled-components';
import { Button, Card } from 'react-bootstrap';
import { ChatLeft, EyeFill } from 'react-bootstrap-icons';
import { correctStrDate } from 'utils/time';

// тут нужно было создать 2 интерфеса что бы не было ommit
// при его расширении другими сомпонентами
export interface PostProp {
  id: number;
  title: string;
  content: string;
  owner: {
    id: number;
    login: string;
  };
  updatedAt: string;
  commentsCount?: number;
  viewsCount?: number;

  clickCommentIcoCb?: () => unknown;
  clickNewCommentCb?: () => unknown;
}

function Post(prop: PostProp): ReactElement {
  const [minutesPass, setMinutesPass] = useState(
    correctStrDate(prop.updatedAt),
  );

  useInterval(() => {
    setMinutesPass(correctStrDate(prop.updatedAt));
  }, 1000);
  return (
    <div className="post">
      <PostStyled>
        <Card className="rounded-start-0">
          <div className="post-header px-3 py-2">
            <div>
              <span className="post-owner-login">{prop.owner?.login}</span>
              <span className="post-time-pass ms-1">{minutesPass}</span>
            </div>
            <div>
              <span className="post-title">{prop.title}</span>
            </div>
          </div>
          <div className="post-content px-3 py-2">{prop.content}</div>
          {(prop.commentsCount ?? prop.viewsCount) == null ? null : (
            <div className="post-footer px-3 py-2">
              {prop.clickNewCommentCb === undefined ? null : (
                <div className="WrapperBtnNewComment me-2">
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={prop.clickNewCommentCb}
                  >
                    New Cooment
                  </Button>
                </div>
              )}

              {prop.commentsCount === undefined ? null : (
                <div
                  className="d-inline h-100 me-2"
                  onClick={
                    prop.clickCommentIcoCb === undefined
                      ? () => {
                          undefined;
                        }
                      : prop.clickCommentIcoCb
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <ChatLeft />
                  <span className="ms-1">{prop.commentsCount}</span>
                </div>
              )}

              {prop.viewsCount === undefined ? null : (
                <div className="d-inline  h-100">
                  <EyeFill />
                  <span className="ms-1">{prop.viewsCount}</span>
                </div>
              )}
            </div>
          )}
        </Card>
      </PostStyled>
    </div>
  );
}

const PostStyled = styled.div`
  .rounded-start-0 {
    border-start-start-radius: 0px !important;
    border-end-start-radius: 0px !important;
  }

  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
  }

  .post-footer,
  .post-content {
    border-top: ${({ theme }) => theme.primaryBorder};
  }

  .post-owner-login {
    color: ${({ theme }) => theme.secondColor};
    font-size: 0.9em;
  }

  .post-time-pass {
    font-size: 0.7em;
  }

  .post-title {
    color: ${({ theme }) => theme.secondColor};
    font-weight: 500;
  }

  .post-footer span {
    font-size: 0.9em;
  }

  .WrapperBtnNewComment {
    display: inline-block;
  }

  .WrapperBtnNewComment .btn {
    padding: 2px 10px;
    font-size: 0.8em;
  }
`;

export default Post;
