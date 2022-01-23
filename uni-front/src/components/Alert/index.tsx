import { ReactElement } from 'react';
import { Card } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import styled from 'styled-components';
import { correctStrDate } from 'utils/time';

interface Owner {
  id: number;
  login: string;
}

interface PostAlert {
  id: number;
  title: string;
  content: string;
  owner: Owner;
  updatedAt: string;
}

interface CommentAlert {
  id: number;
  owner: Owner;
  content: string;
  updatedAt: string;
}

interface AlertProp {
  id: number;
  level: 'error' | 'success' | 'info';
  updatedAt: string;
  title: string;
  post: PostAlert | null;
  comment1: CommentAlert | null;
  comment2: CommentAlert | null;
  reason: string | null;
}

function Alert(prop: AlertProp): ReactElement {
  const userId = useSelector(
    (store: RootState) => store.auth.user?.id,
    shallowEqual,
  );

  return (
    <AlertStyled>
      <Card className={prop.level + ' px-3 py-2'}>
        <div className="header">
          <span className="title">{prop.title}</span>
          <span className="time-pass ms-1">
            {correctStrDate(prop.updatedAt)}
          </span>
        </div>
        {prop.post == null ? null : (
          <div className="mt-2">
            <span>Post:</span>
            <div className="post p-2">
              <div className="header">
                <span className="owner">
                  {prop.post.owner.id === userId
                    ? 'You'
                    : prop.post.owner.login}
                </span>
                <span className="time-pass ms-1">
                  {correctStrDate(prop.post.updatedAt)}
                </span>
              </div>
              <div className="content">
                <span>{prop.post.title}</span>
              </div>
            </div>
          </div>
        )}
        {[prop.comment1, prop.comment2].map((comment, ind) => {
          if (comment == null) return null;
          else
            return (
              <div key={ind} className="mt-2">
                {ind !== 0 ? null : (
                  <span>Comment{prop.comment2 != null ? 's' : ''}:</span>
                )}
                <div className={'comment p-2'}>
                  <div className="header">
                    <span className="owner">
                      {comment.owner.id === userId
                        ? 'You'
                        : comment.owner.login}
                    </span>
                    <span className="time-pass ms-1">
                      {correctStrDate(comment.updatedAt)}
                    </span>
                  </div>
                  <div className="content">
                    <span>{comment.content}</span>
                  </div>
                </div>
              </div>
            );
        })}
        {prop.reason == null ? null : (
          <div className="reason mt-2">
            <span>Reason: {prop.reason}</span>
          </div>
        )}
      </Card>
    </AlertStyled>
  );
}

const AlertStyled = styled.div`
  .card.error {
    background-color: ${({ theme }) => theme.alertErrorBgc};
  }
  .card.success {
    background-color: ${({ theme }) => theme.alertSuccessBgc};
  }
  .card.info {
    background-color: ${({ theme }) => theme.alertInfoBgc};
  }

  .time-pass {
    font-size: 0.7em;
  }

  .post,
  .comment {
    background-color: ${({ theme }) => theme.primaryBgc};
  }
`;

export default Alert;
